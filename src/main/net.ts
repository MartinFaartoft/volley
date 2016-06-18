/// <reference path="piston-0.1.1.d.ts" />

namespace volley {
    export class Net extends ps.Entity {
        public static HEIGHT: number = 300;
        public static THICKNESS: number = 10;

        constructor() {
            super([1024 / 2.0, 768], [0, 0], 0);
        }

        render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "purple";
            ctx.fillRect(this.pos[0], this.pos[1], Net.THICKNESS, -Net.HEIGHT);
        }
    }
}