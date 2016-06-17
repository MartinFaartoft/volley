/// <reference path="piston-0.1.1.d.ts" />

namespace volley {
    export class Player extends ps.Entity implements ps.Collidable {
        constructor(pos: number[], public color: string, radius: number, public keys: string[]) {
            super(pos, [0, 0], radius);
        }

        render(ctx: CanvasRenderingContext2D, state: VolleyState) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI, true);
            ctx.fill();
        }

        collideWith(other: ps.Collidable) {}

        handleInput() {
            this.speed[0] = 0;
            if (ps.isKeyDown(this.keys[0])) {
                this.speed[0] = -200;
            }
            else if (ps.isKeyDown(this.keys[1])) {
                this.speed[0] = 200;
            }
        }
    }
}