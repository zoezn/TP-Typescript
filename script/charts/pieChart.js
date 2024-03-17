var PieChart = /** @class */ (function () {
  function PieChart(canvas, tooltip) {
    var _this = this;
    this.canvas = canvas;
    this.tooltip = tooltip;
    this.colors = ["#34a853", "#FBBC05", "#dc9c9c", "#4285F4"];
    this.context = canvas.getContext("2d");
    this.tipContext = tooltip.getContext("2d");
    this.data = this.getData(canvas);
    canvas.addEventListener("click", function (e) {
      return _this.onClick(e);
    });
    canvas.addEventListener("mousemove", function (e) {
      return _this.onMouseOver(e);
    });
    canvas.addEventListener("mouseleave", function (e) {
      return _this.onMouseLeave(e);
    });
    this.pie = {
      x0: this.canvas.width / 2,
      y0: this.canvas.height / 2,
      radius: (Math.min(this.canvas.width, this.canvas.height) / 2) * 0.9,
    };
  }
  PieChart.prototype.getData = function (elem) {
    var stringValues = elem.getAttribute("values");
    var stringLabels = elem.getAttribute("labels");
    var values = JSON.parse(stringValues);
    var labels = JSON.parse(stringLabels);
    if (Array.isArray(values) && Array.isArray(labels)) {
      var data_1 = [];
      var startAngle_1 = 0;
      var sum_1 = this.sum(values);
      values.forEach(function (value, idx) {
        var endAngle = startAngle_1 + (value / sum_1) * 2 * Math.PI;
        data_1.push({
          value: value,
          label: labels[idx],
          startAngle: startAngle_1,
          endAngle: endAngle,
        });
        startAngle_1 = endAngle;
      });
      return data_1;
    } else {
      throw new Error("Data missing or not set properly");
    }
  };
  PieChart.prototype.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  PieChart.prototype.sum = function (array) {
    var sum = 0;
    array.forEach(function (value) {
      return (sum += value);
    });
    return sum;
  };
  PieChart.prototype.render = function () {
    var _this = this;
    var p = 0;
    var interval = setInterval(function () {
      if (p <= 100) {
        _this.drawPie(p);
        p += 5;
      } else {
        clearInterval(interval);
      }
    }, 60);
  };
  PieChart.prototype.drawPie = function (p, pidx) {
    var _this = this;
    var ctx = this.context;
    var pie = this.pie;
    this.clear();
    this.data.forEach(function (part, idx) {
      // Set style
      ctx.fillStyle = _this.colors[idx % _this.colors.length];
      ctx.strokeStyle = "grey";
      ctx.beginPath();
      ctx.moveTo(pie.x0, pie.y0);
      if (typeof pidx === "number") {
        if (pidx === idx) {
          ctx.arc(
            pie.x0,
            pie.y0,
            pie.radius * 1.05,
            part.startAngle * (p / 100),
            part.endAngle * (p / 100)
          );
        } else {
          ctx.arc(
            pie.x0,
            pie.y0,
            pie.radius,
            part.startAngle * (p / 100),
            part.endAngle * (p / 100)
          );
        }
      } else {
        ctx.arc(
          pie.x0,
          pie.y0,
          pie.radius,
          part.startAngle * (p / 100),
          part.endAngle * (p / 100)
        );
      }
      ctx.fill();
      //ctx.stroke();
      ctx.closePath();
    });
  };
  PieChart.prototype.onClick = function (event) {
    var dataIdx = this.getCoordinates(event).dataIdx;
    console.log("Label: ".concat(this.getInfo(dataIdx)));
  };
  PieChart.prototype.getCoordinates = function (event) {
    var pie = this.pie;
    var rect = this.canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var radius = Math.sqrt(
      (x - pie.x0) * (x - pie.x0) + (y - pie.y0) * (y - pie.y0)
    );
    var angle =
      Math.atan2(y - pie.y0, x - pie.x0) + (y < pie.y0 ? 2 * Math.PI : 0);
    var dataIdx = -1;
    if (radius <= pie.radius) {
      this.data.forEach(function (part, idx) {
        if (angle >= part.startAngle && angle < part.endAngle) {
          dataIdx = idx;
        }
      });
    }
    return {
      clientX: event.clientX,
      clientY: event.clientY,
      x: x,
      y: y,
      radius: radius,
      angle: angle,
      dataIdx: dataIdx,
    };
  };
  PieChart.prototype.getInfo = function (dataIdx) {
    return dataIdx > -1
      ? ""
          .concat(this.data[dataIdx].label, ": ")
          .concat(this.data[dataIdx].value)
      : "Out of pie";
  };
  PieChart.prototype.onMouseOver = function (event) {
    var _a = this.getCoordinates(event),
      clientX = _a.clientX,
      clientY = _a.clientY,
      radius = _a.radius,
      angle = _a.angle,
      dataIdx = _a.dataIdx;
    var width = this.tooltip.width;
    var height = this.tooltip.height;
    this.drawPie(100, dataIdx);
    if (radius <= this.pie.radius) {
      var offsetX = 0;
      if (clientX - width / 2 > 0) {
        if (clientX + width / 2 >= window.innerWidth) {
          offsetX = clientX - width;
        } else {
          offsetX = width / 2;
        }
      } else {
        offsetX = clientX;
      }
      // Position
      this.tooltip.style.left = (clientX - offsetX).toString() + "px";
      this.tooltip.style.top = (clientY - 40).toString() + "px";
      // Clear tip
      this.tipContext.clearRect(0, 0, width, height);
      this.tooltip.style.display = "block";
      // Resize tooltip
      this.tipContext.font = "bold 10px sans-serif";
      var tipWidth = this.tipContext.measureText(this.getInfo(dataIdx)).width;
      this.tooltip.width = tipWidth * 1.6 + 5;
      // Draw color box
      this.tipContext.rect(10, 7, 10, 10);
      this.tipContext.fillStyle = this.colors[dataIdx % this.colors.length];
      this.tipContext.fill();
      // Write text
      this.tipContext.textAlign = "center";
      this.tipContext.fillStyle = "white";
      this.tipContext.fillText(this.getInfo(dataIdx), width / 2 + 10, 15);
    } else {
      this.tooltip.style.display = "none";
    }
  };
  PieChart.prototype.onMouseLeave = function (event) {
    this.drawPie(100);
    this.tooltip.style.display = "none";
  };
  return PieChart;
})();
var pieChartElement = document.getElementById("pieChart");
var tooltipElement = document.getElementById("tip");
var pieChart = new PieChart(pieChartElement, tooltipElement);
pieChart.render();
