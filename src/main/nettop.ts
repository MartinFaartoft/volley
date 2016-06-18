/// <reference path="piston-0.1.1.d.ts" />

namespace volley {
    export class NetTop extends ps.Entity implements ps.Collidable {
        public static RADIUS: number = Net.THICKNESS / 2.0;
        constructor() {
            super([1024 / 2.0 + NetTop.RADIUS, 768 - Net.HEIGHT], [0, 0], NetTop.RADIUS);
        }

        render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "purple";
            ctx.beginPath();
            ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
            ctx.fill();
         }

        collideWith(other: ps.Collidable) {}
    }
}