/// <reference path="ball.ts" />
/// <reference path="player.ts" />


namespace volley {
    export class VolleyState extends ps.BaseGameState {
        ball: Ball;
        leftPlayer: Player;
        rightPlayer: Player;

        constructor(public dimsensions: number[], public debug: boolean) {
            super(dimsensions);
            this.ball = new Ball([500, 100], [200, 0], [0, 400], 50);
            this.leftPlayer = new Player([200, 768], "green", 50, ["a", "d"]);
            this.rightPlayer = new Player([890, 768], "blue", 50, ["LEFT", "RIGHT"]);
        }

        render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.dimensions[0], this.dimensions[1]);
            this.ball.render(ctx, this);
            this.leftPlayer.render(ctx, this);
            this.rightPlayer.render(ctx, this);
        }

        update(dt: number) {
            this.rightPlayer.handleInput();
            this.leftPlayer.handleInput();
            this.ball.update(dt, this);
            this.leftPlayer.update(dt, this);
            this.rightPlayer.update(dt, this);

            ps.detectCircularCollision(this.ball, this.leftPlayer, this);
            ps.detectCircularCollision(this.ball, this.rightPlayer, this);
        }
    }
}