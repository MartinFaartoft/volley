/// <reference path="piston-0.1.1.d.ts" />

namespace volley {
    export enum PlayerDirection {
            Left,
            Right
        }

    export class Player extends ps.Entity implements ps.Collidable {
        accel: number[] = [0, 900];
        isJumping: boolean = false;

        constructor(pos: number[], 
                    public color: string, 
                    radius: number, 
                    public keys: string[], 
                    public direction: PlayerDirection) {
            super(pos, [0, 0], radius);
        }

        render(ctx: CanvasRenderingContext2D, state: VolleyState) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI, true);
            ctx.fill();

            this.renderEye(ctx);
        }

        private renderEye(ctx: CanvasRenderingContext2D) {
            let eyeX = this.pos[0] + ((this.radius / 2.0) * (this.direction === PlayerDirection.Right ? -1 : 1));
            let eyeY = this.pos[1] - this.radius / 2.0
            let pupilX = eyeX + 2 * (this.direction === PlayerDirection.Right ? -1 : 1);
            let pupilY = eyeY;
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(pupilX, eyeY, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        update(dt: number, state: VolleyState) {
            if (this.isJumping) {
                if (this.pos[1] < state.dimensions[1]) {
                    this.accelerate(dt);
                } else { //jump is over
                    this.speed[1] = 0;
                    this.pos[1] = state.dimensions[1];
                    this.isJumping = false;
                }
            }

            this.pos[0] += this.speed[0] * dt;
            this.pos[1] += this.speed[1] * dt;
        }

         accelerate(dt: number) {
            this.speed[0] += this.accel[0] * dt;
            this.speed[1] += this.accel[1] * dt;
        }

        collideWith(other: ps.Collidable) {}

        handleInput() {
            this.speed[0] = 0;
            if (ps.isKeyDown(this.keys[0])) {
                this.speed[0] = -300;
            }
            else if (ps.isKeyDown(this.keys[1])) {
                this.speed[0] = 300;
            }
            
            if (ps.isKeyDown(this.keys[2])) {
                if (!this.isJumping) {
                    this.isJumping = true;
                    this.speed[1] = -300;
                    this.pos[1] -= 1;
                }
            }
        }
    }
}