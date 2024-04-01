class PieChart {
    constructor(canvas, tooltip) {
        this.canvas = canvas;
        this.tooltip = tooltip;
        this.colors = ["#dc9c9c", "#FBBC05", "#EA4335", "#4285F4"];
        this.context = canvas.getContext("2d");
        this.tipContext = tooltip.getContext("2d");
        this.data = this.getData(canvas);
        canvas.addEventListener("click", (e) => this.onClick(e));
        canvas.addEventListener("mousemove", (e) => this.onMouseOver(e));
        canvas.addEventListener("mouseleave", (e) => this.onMouseLeave(e));
        this.pie = {
            x0: this.canvas.width / 2,
            y0: this.canvas.height / 2,
            radius: (Math.min(this.canvas.width, this.canvas.height) / 2) * 0.9,
        };
    }
    getData(elem) {
        const stringValues = elem.getAttribute("values");
        const stringLabels = elem.getAttribute("labels");
        const values = JSON.parse(stringValues);
        const labels = JSON.parse(stringLabels);
        if (Array.isArray(values) && Array.isArray(labels)) {
            let data = [];
            let startAngle = 0;
            const sum = this.sum(values);
            values.forEach((value, idx) => {
                let endAngle = startAngle + (value / sum) * 2 * Math.PI;
                data.push({
                    value: value,
                    label: labels[idx],
                    startAngle: startAngle,
                    endAngle: endAngle,
                });
                startAngle = endAngle;
            });
            return data;
        }
        else {
            throw new Error("Data missing or not set properly");
        }
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    sum(array) {
        let sum = 0;
        array.forEach((value) => (sum += value));
        return sum;
    }
    render() {
        let p = 0;
        let interval = setInterval(() => {
            if (p <= 100) {
                this.drawPie(p);
                p += 5;
            }
            else {
                clearInterval(interval);
            }
        }, 60);
    }
    drawPie(p, pidx) {
        const ctx = this.context;
        const pie = this.pie;
        this.clear();
        this.data.forEach((part, idx) => {
            // Set style
            ctx.fillStyle = this.colors[idx % this.colors.length];
            ctx.strokeStyle = "grey";
            ctx.beginPath();
            ctx.moveTo(pie.x0, pie.y0);
            if (typeof pidx === "number") {
                if (pidx === idx) {
                    ctx.arc(pie.x0, pie.y0, pie.radius * 1.05, part.startAngle * (p / 100), part.endAngle * (p / 100));
                }
                else {
                    ctx.arc(pie.x0, pie.y0, pie.radius, part.startAngle * (p / 100), part.endAngle * (p / 100));
                }
            }
            else {
                ctx.arc(pie.x0, pie.y0, pie.radius, part.startAngle * (p / 100), part.endAngle * (p / 100));
            }
            ctx.fill();
            //ctx.stroke();
            ctx.closePath();
        });
    }
    onClick(event) {
        const { dataIdx } = this.getCoordinates(event);
        console.log(`Label: ${this.getInfo(dataIdx)}`);
    }
    getCoordinates(event) {
        const pie = this.pie;
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const radius = Math.sqrt((x - pie.x0) * (x - pie.x0) + (y - pie.y0) * (y - pie.y0));
        const angle = Math.atan2(y - pie.y0, x - pie.x0) + (y < pie.y0 ? 2 * Math.PI : 0);
        let dataIdx = -1;
        if (radius <= pie.radius) {
            this.data.forEach((part, idx) => {
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
    }
    getInfo(dataIdx) {
        return dataIdx > -1
            ? `${this.data[dataIdx].label}: ${this.data[dataIdx].value}`
            : "Out of pie";
    }
    onMouseOver(event) {
        const { clientX, clientY, radius, angle, dataIdx } = this.getCoordinates(event);
        const width = this.tooltip.width;
        const height = this.tooltip.height;
        this.drawPie(100, dataIdx);
        if (radius <= this.pie.radius) {
            let offsetX = 0;
            if (clientX - width / 2 > 0) {
                if (clientX + width / 2 >= window.innerWidth) {
                    offsetX = clientX - width;
                }
                else {
                    offsetX = width / 2;
                }
            }
            else {
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
            let tipWidth = this.tipContext.measureText(this.getInfo(dataIdx)).width;
            this.tooltip.width = tipWidth * 1.6 + 5;
            // Draw color box
            this.tipContext.rect(10, 7, 10, 10);
            this.tipContext.fillStyle = this.colors[dataIdx % this.colors.length];
            this.tipContext.fill();
            // Write text
            this.tipContext.textAlign = "center";
            this.tipContext.fillStyle = "white";
            this.tipContext.fillText(this.getInfo(dataIdx), width / 2 + 10, 15);
        }
        else {
            this.tooltip.style.display = "none";
        }
    }
    onMouseLeave(event) {
        this.drawPie(100);
        this.tooltip.style.display = "none";
    }
}
const pieChartElement = (document.getElementById("pieChart"));
const tooltipElement = (document.getElementById("tip"));
const pieChart = new PieChart(pieChartElement, tooltipElement);
export const render = () => pieChart.render();
pieChart.render();
