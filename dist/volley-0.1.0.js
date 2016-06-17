var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="piston-0.1.0.d.ts" />
var volley;
(function (volley) {
    var Ball = (function (_super) {
        __extends(Ball, _super);
        function Ball(pos, speed, accel, radius) {
            _super.call(this, pos, speed, radius);
            this.pos = pos;
            this.speed = speed;
            this.accel = accel;
            this.friction = [0.0001, .001];
        }
        Ball.prototype.render = function (ctx, state) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
            ctx.fill();
        };
        Ball.prototype.update = function (dt, state) {
            this.checkCollisions(state);
            this.accelerate(dt);
        };
        Ball.prototype.accelerate = function (dt) {
            this.speed[0] += this.accel[0] * dt;
            this.speed[1] += this.accel[1] * dt;
            //apply friction
            this.speed[0] *= 1 - this.friction[0];
            this.speed[1] *= 1 - this.friction[1];
            this.pos[0] += this.speed[0] * dt;
            this.pos[1] += this.speed[1] * dt;
        };
        Ball.prototype.checkCollisions = function (state) {
            //if overlapping floor and moving down
            if (this.pos[1] + this.radius >= state.dimensions[1] && this.speed[1] > 0) {
                this.speed[1] = this.speed[1] * -1;
            }
            //if overlapping left wall and moving left
            if (this.pos[0] - this.radius < 0 && this.speed[0] < 0) {
                this.speed[0] *= -1;
            } //if overlapping right wall and moving right
            else if (this.pos[0] + this.radius > state.dimensions[0] && this.speed[0] > 0) {
                this.speed[0] *= -1;
            }
        };
        return Ball;
    }(ps.Entity));
    volley.Ball = Ball;
})(volley || (volley = {}));
/// <reference path="ball.ts" />
var volley;
(function (volley) {
    var VolleyState = (function (_super) {
        __extends(VolleyState, _super);
        function VolleyState(dimsensions, debug) {
            _super.call(this, dimsensions);
            this.dimsensions = dimsensions;
            this.debug = debug;
            this.ball = new volley.Ball([500, 100], [200, 0], [0, 400], 50);
        }
        VolleyState.prototype.render = function (ctx) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.dimensions[0], this.dimensions[1]);
            this.ball.render(ctx, this);
        };
        VolleyState.prototype.update = function (dt) {
            this.ball.update(dt, this);
        };
        return VolleyState;
    }(ps.BaseGameState));
    volley.VolleyState = VolleyState;
})(volley || (volley = {}));
/// <reference path="piston-0.1.0.d.ts" />
/// <reference path="volleystate.ts" />
var volley;
(function (volley) {
    // create canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 768;
    document.body.appendChild(canvas);
    // prepare game state and engine
    var debug = false;
    var dimensions = [canvas.width, canvas.height];
    //let resourceManager: ps.ResourceManager = new ps.ResourceManager();
    var state = new volley.VolleyState(dimensions, debug);
    var engine = new ps.Engine(state, ctx, debug);
    engine.run();
})(volley || (volley = {}));
//# sourceMappingURL=volley-0.1.0.js.map