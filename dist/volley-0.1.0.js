/*! volley - v0.1.0 - 2016-06-19
* https://github.com/martinfaartoft/volley/
* Copyright (c) 2016 Piston.js <martin.faartoft@gmail.com>; Licensed MIT*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="piston-0.2.0.d.ts" />
/// <reference path="volleystate.ts" />
var volley;
(function (volley) {
    var Ball = (function (_super) {
        __extends(Ball, _super);
        function Ball(pos, speed, accel, radius) {
            _super.call(this, pos, speed, radius);
            this.pos = pos;
            this.accel = accel;
            this.friction = new ps.Vector(0.0001, .001);
            this.collided = 0;
            this.mass = 25;
        }
        Ball.prototype.render = function (ctx, state) {
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        };
        Ball.prototype.update = function (dt, state) {
            this.checkWallCollisions(state);
            this.checkNetCollision(state);
            if (this.collided > 0) {
                this.collided -= dt;
            }
            this.accelerate(dt);
        };
        Ball.prototype.accelerate = function (dt) {
            this.speed = this.speed.add(this.accel.multiply(dt));
            //apply friction
            this.speed.x *= 1 - this.friction.x;
            this.speed.y *= 1 - this.friction.y;
            this.pos = this.pos.add(this.speed.multiply(dt));
        };
        Ball.prototype.checkNetCollision = function (state) {
            if (this.collided > 0) {
                return;
            }
            var netX = state.net.pos.x;
            var netY = state.net.pos.y - volley.Net.HEIGHT;
            var xOverlap = this.pos.x > netX - this.radius && this.pos.x < netX + this.radius + volley.Net.THICKNESS;
            var yOverlap = this.pos.y > netY - this.radius + 20 && this.pos.y < state.net.pos.y;
            if (xOverlap && yOverlap) {
                this.speed.x *= -1;
                this.collided = .1;
            }
        };
        Ball.prototype.checkWallCollisions = function (state) {
            //if overlapping floor and moving down
            if (this.pos.y + this.radius >= state.dimensions.y && this.speed.y > 0) {
                this.speed.y *= -1;
            } //if overlapping ceiling and moving up 
            else if (this.pos.y - this.radius < 0 && this.speed.y < 0) {
                this.speed.y *= -1;
            }
            //if overlapping left wall and moving left
            if (this.pos.x - this.radius < 0 && this.speed.x < 0) {
                this.speed.x *= -1;
            } //if overlapping right wall and moving right
            else if (this.pos.x + this.radius > state.dimensions.x && this.speed.x > 0) {
                this.speed.x *= -1;
            }
        };
        //http://vobarian.com/collisions/2dcollisions2.pdf
        Ball.prototype.collideWith = function (other) {
            if (this.collided > 0) {
                return; //already handled
            }
            this.collided = .1;
            var x0 = this.pos.x;
            var y0 = this.pos.y;
            var x1 = other.pos.x;
            var y1 = other.pos.y;
            var pos0 = new ps.Vector(x0, y0);
            var pos1 = new ps.Vector(x1, y1);
            //1: find unit normal and unit tangent vectors
            var v_unit_normal = pos1.subtract(pos0).unit();
            var v_unit_tangent = v_unit_normal.tangent();
            //2: create initial velocity vectors
            //3: calculate scalar velocities in the normal and tangential direction for both
            var s_v0_n = v_unit_normal.dot(this.speed);
            var s_v0_t = v_unit_tangent.dot(this.speed);
            var s_v1_n = v_unit_normal.dot(other.speed);
            var s_v1_t = v_unit_tangent.dot(other.speed);
            //4: find the new tangential velocities after collisions
            //unchanged, so using previous values (s_v0_t, s_v1_t)
            //5: find new normal velocities
            var p_s_v0_n = this.calculateNormalVelocity(s_v0_n, s_v1_n, this.mass, other.mass);
            var p_s_v1_n = this.calculateNormalVelocity(s_v1_n, s_v0_n, other.mass, this.mass);
            //6: convert scalar normal and tangential velocities into vectors
            var p_v0_n = v_unit_normal.multiply(p_s_v0_n);
            var p_v1_n = v_unit_normal.multiply(p_s_v1_n);
            var p_v0_t = v_unit_tangent.multiply(s_v0_t);
            var p_v1_t = v_unit_tangent.multiply(s_v1_t);
            //7: find final velocity vectors by adding normal and tangential components
            var p_v0 = p_v0_n.add(p_v0_t);
            var p_v1 = p_v1_n.add(p_v0_t);
            this.speed = p_v0;
            //this.speed = new ps.Vector(post_v0[0], post_v0[1]);
        };
        Ball.prototype.calculateNormalVelocity = function (v1n, v2n, m1, m2) {
            return (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
        };
        return Ball;
    }(ps.Entity));
    volley.Ball = Ball;
})(volley || (volley = {}));
/// <reference path="piston-0.2.0.d.ts" />
var volley;
(function (volley) {
    (function (PlayerDirection) {
        PlayerDirection[PlayerDirection["Left"] = 0] = "Left";
        PlayerDirection[PlayerDirection["Right"] = 1] = "Right";
    })(volley.PlayerDirection || (volley.PlayerDirection = {}));
    var PlayerDirection = volley.PlayerDirection;
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(pos, color, radius, keys, direction) {
            _super.call(this, pos, new ps.Vector(0, 0), radius);
            this.color = color;
            this.keys = keys;
            this.direction = direction;
            this.accel = new ps.Vector(0, 900);
            this.isJumping = false;
            this.mass = 100;
        }
        Player.prototype.render = function (ctx, state) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI, true);
            ctx.fill();
            this.renderEye(ctx);
        };
        Player.prototype.renderEye = function (ctx) {
            var eyeX = this.pos.x + ((this.radius / 2.0) * (this.direction === PlayerDirection.Right ? -1 : 1));
            var eyeY = this.pos.y - this.radius / 2.0;
            var pupilX = eyeX + 2 * (this.direction === PlayerDirection.Right ? -1 : 1);
            var pupilY = eyeY;
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(pupilX, eyeY, 2, 0, Math.PI * 2);
            ctx.fill();
        };
        Player.prototype.update = function (dt, state) {
            if (this.isJumping) {
                if (this.pos.y < state.dimensions.y) {
                    this.accelerate(dt);
                }
                else {
                    this.speed.y = 0;
                    this.pos.y = state.dimensions.y;
                    this.isJumping = false;
                }
            }
            this.pos.x += this.speed.x * dt;
            this.pos.y += this.speed.y * dt;
        };
        Player.prototype.accelerate = function (dt) {
            this.speed.x += this.accel.x * dt;
            this.speed.y += this.accel.y * dt;
        };
        Player.prototype.collideWith = function (other) { };
        Player.prototype.handleInput = function () {
            this.speed.x = 0;
            if (ps.isKeyDown(this.keys[0])) {
                this.speed.x = -300;
            }
            else if (ps.isKeyDown(this.keys[1])) {
                this.speed.x = 300;
            }
            if (ps.isKeyDown(this.keys[2])) {
                if (!this.isJumping) {
                    this.isJumping = true;
                    this.speed.y = -300;
                    this.pos.y -= 1;
                }
            }
        };
        return Player;
    }(ps.Entity));
    volley.Player = Player;
})(volley || (volley = {}));
/// <reference path="piston-0.2.0.d.ts" />
var volley;
(function (volley) {
    var Net = (function (_super) {
        __extends(Net, _super);
        function Net() {
            _super.call(this, new ps.Point(1024 / 2.0, 768), new ps.Vector(0, 0), 0);
        }
        Net.prototype.render = function (ctx) {
            ctx.fillStyle = "purple";
            ctx.fillRect(this.pos.x, this.pos.y, Net.THICKNESS, -Net.HEIGHT);
        };
        Net.HEIGHT = 300;
        Net.THICKNESS = 10;
        return Net;
    }(ps.Entity));
    volley.Net = Net;
})(volley || (volley = {}));
/// <reference path="piston-0.2.0.d.ts" />
var volley;
(function (volley) {
    var NetTop = (function (_super) {
        __extends(NetTop, _super);
        function NetTop() {
            _super.call(this, new ps.Point(1024 / 2.0 + NetTop.RADIUS, 768 - volley.Net.HEIGHT), new ps.Vector(0, 0), NetTop.RADIUS);
            this.mass = 100;
        }
        NetTop.prototype.render = function (ctx) {
            ctx.fillStyle = "purple";
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        };
        NetTop.prototype.collideWith = function (other) { };
        NetTop.RADIUS = volley.Net.THICKNESS / 2.0;
        return NetTop;
    }(ps.Entity));
    volley.NetTop = NetTop;
})(volley || (volley = {}));
/// <reference path="ball.ts" />
/// <reference path="player.ts" />
/// <reference path="net.ts" />
/// <reference path="nettop.ts" />
var volley;
(function (volley) {
    var VolleyState = (function (_super) {
        __extends(VolleyState, _super);
        function VolleyState(dimensions, debug) {
            _super.call(this, dimensions);
            this.dimensions = dimensions;
            this.debug = debug;
            this.ball = new volley.Ball(new ps.Point(500, 100), new ps.Vector(200, 0), new ps.Vector(0, 400), 50);
            this.leftPlayer = new volley.Player(new ps.Point(200, 768), "green", 50, ["a", "d", "w"], volley.PlayerDirection.Left);
            this.rightPlayer = new volley.Player(new ps.Point(890, 768), "blue", 50, ["LEFT", "RIGHT", "UP"], volley.PlayerDirection.Right);
            this.net = new volley.Net();
            this.netTop = new volley.NetTop();
        }
        VolleyState.prototype.render = function (ctx) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.dimensions.x, this.dimensions.y);
            this.net.render(ctx);
            this.netTop.render(ctx);
            this.ball.render(ctx, this);
            this.leftPlayer.render(ctx, this);
            this.rightPlayer.render(ctx, this);
        };
        VolleyState.prototype.update = function (dt) {
            this.rightPlayer.handleInput();
            this.leftPlayer.handleInput();
            ps.detectCircularCollision(this.ball, this.leftPlayer, this);
            ps.detectCircularCollision(this.ball, this.rightPlayer, this);
            ps.detectCircularCollision(this.ball, this.netTop, this);
            this.ball.update(dt, this);
            this.leftPlayer.update(dt, this);
            this.rightPlayer.update(dt, this);
        };
        return VolleyState;
    }(ps.BaseGameState));
    volley.VolleyState = VolleyState;
})(volley || (volley = {}));
/// <reference path="piston-0.2.0.d.ts" />
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
    var dimensions = new ps.Vector(canvas.width, canvas.height);
    //let resourceManager: ps.ResourceManager = new ps.ResourceManager();
    var state = new volley.VolleyState(dimensions, debug);
    var engine = new ps.Engine(state, ctx, debug);
    engine.run();
})(volley || (volley = {}));
//# sourceMappingURL=volley-0.1.0.js.map