/// <reference path="ball.ts" />

namespace volley {
    export class VolleyState extends ps.BaseGameState {
        ball: Ball;
        
        constructor(public dimsensions: number[], public debug: boolean) {
            super(dimsensions);
            this.ball = new Ball([500, 100], [200, 0], [0, 400], 50);
        }

        render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.dimensions[0], this.dimensions[1]);
            this.ball.render(ctx, this);
        }

        update(dt: number) {
            this.ball.update(dt, this);
        }
    }
}