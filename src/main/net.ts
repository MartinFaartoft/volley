/// <reference path="piston-0.2.0.d.ts" />

namespace volley {
    export class Net extends ps.Entity {
        public static HEIGHT: number = 300;
        public static THICKNESS: number = 10;
        
        constructor() {
            super(new ps.Point(1024 / 2.0, 768), new ps.Vector(0, 0), 0);
        }

        render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "purple";
            ctx.fillRect(this.pos.x, this.pos.y, Net.THICKNESS, -Net.HEIGHT);
        }
    }
}