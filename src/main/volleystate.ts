/// <reference path="ball.ts" />
/// <reference path="player.ts" />
/// <reference path="net.ts" />
/// <reference path="nettop.ts" />

namespace volley {
    export class VolleyState extends ps.BaseGameState {
        ball: Ball;
        leftPlayer: Player;
        rightPlayer: Player;
        net: Net;
        netTop: NetTop;

        constructor(public dimensions: number[], public debug: boolean) {
            super(dimensions);
            this.ball = new Ball([500, 100], [200, 0], [0, 400], 50);
            this.leftPlayer = new Player([200, 768], "green", 50, ["a", "d", "w"], PlayerDirection.Left);
            this.rightPlayer = new Player([890, 768], "blue", 50, ["LEFT", "RIGHT", "UP"], PlayerDirection.Right);
            this.net = new Net();
            this.netTop = new NetTop();
        }

        render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.dimensions[0], this.dimensions[1]);
            this.net.render(ctx);
            this.netTop.render(ctx);
            this.ball.render(ctx, this);
            this.leftPlayer.render(ctx, this);
            this.rightPlayer.render(ctx, this);
        }

        update(dt: number) {
            this.rightPlayer.handleInput();
            this.leftPlayer.handleInput();
            
            ps.detectCircularCollision(this.ball, this.leftPlayer, this);
            ps.detectCircularCollision(this.ball, this.rightPlayer, this);
            ps.detectCircularCollision(this.ball, this.netTop, this);
            
            this.ball.update(dt, this);
            this.leftPlayer.update(dt, this);
            this.rightPlayer.update(dt, this);
        }
    }
}