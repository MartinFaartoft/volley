/// <reference path="piston-0.1.0.d.ts" />

namespace volley {
    export class Ball extends ps.Entity {
        friction: number[] = [0.0001, .001];

        constructor(public pos: number[], public speed: number[], public accel: number[], radius: number) {
            super(pos, speed, radius);
        }

        render(ctx: CanvasRenderingContext2D, state: VolleyState) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        update(dt: number, state: VolleyState) {
            this.checkCollisions(state);
            this.accelerate(dt);
        }

        accelerate(dt: number) {
            this.speed[0] += this.accel[0] * dt;
            this.speed[1] += this.accel[1] * dt;

            //apply friction
            this.speed[0] *= 1 - this.friction[0];
            this.speed[1] *= 1 - this.friction[1];

            this.pos[0] += this.speed[0] * dt;
            this.pos[1] += this.speed[1] * dt;
        }

        checkCollisions(state: VolleyState) {
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
        }
    }
}