/// <reference path="piston-0.2.0.d.ts" />

namespace volley {
    export class NetTop extends ps.Entity implements ps.Collidable {
        public static RADIUS: number = Net.THICKNESS / 2.0;

        mass: number = 100;
        constructor() {
            super(
                new ps.Point(1024 / 2.0 + NetTop.RADIUS, 768 - Net.HEIGHT), 
                new ps.Vector(0, 0), 
                NetTop.RADIUS
            );
        }

        render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "purple";
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
         }

        collideWith(other: ps.Collidable) {}
    }
}