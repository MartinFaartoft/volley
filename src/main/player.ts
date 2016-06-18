/// <reference path="piston-0.2.0.d.ts" />

namespace volley {
    export enum PlayerDirection {
            Left,
            Right
        }

    export class Player extends ps.Entity implements ps.Collidable {
        accel: ps.Vector = new ps.Vector(0, 900);
        isJumping: boolean = false;
        mass: number = 100;

        constructor(pos: ps.Point, 
                    public color: string, 
                    radius: number, 
                    public keys: string[], 
                    public direction: PlayerDirection) {
            super(pos, new ps.Vector(0, 0), radius);
        }

        render(ctx: CanvasRenderingContext2D, state: VolleyState) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI, true);
            ctx.fill();

            this.renderEye(ctx);
        }

        private renderEye(ctx: CanvasRenderingContext2D) {
            let eyeX = this.pos.x + ((this.radius / 2.0) * (this.direction === PlayerDirection.Right ? -1 : 1));
            let eyeY = this.pos.y - this.radius / 2.0
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
                if (this.pos.y < state.dimensions.y) {
                    this.accelerate(dt);
                } else { //jump is over
                    this.speed.y = 0;
                    this.pos.y = state.dimensions.y;
                    this.isJumping = false;
                }
            }

            this.pos.x += this.speed.x * dt;
            this.pos.y += this.speed.y * dt;
        }

         accelerate(dt: number) {
            this.speed.x += this.accel.x * dt;
            this.speed.y += this.accel.y * dt;
        }

        collideWith(other: ps.Collidable) {}

        handleInput() {
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
        }
    }
}