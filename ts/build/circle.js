var Circle = /** @class */ (function () {
    function Circle(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    Circle.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };
    return Circle;
}());
//# sourceMappingURL=circle.js.map