/// <reference path="piston-0.1.1.d.ts" />
/// <reference path="volleystate.ts" />


namespace volley {
    export class Ball extends ps.Entity implements ps.Collidable {
        friction: number[] = [0.0001, .001];
        collided: number = 0;

        constructor(public pos: number[], public speed: number[], public accel: number[], radius: number) {
            super(pos, speed, radius);
        }

        render(ctx: CanvasRenderingContext2D, state: VolleyState) {
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        update(dt: number, state: VolleyState) {
            this.checkWallCollisions(state);
            this.checkNetCollision(state);
            if (this.collided > 0) {
                this.collided -= dt;
            }

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

        checkNetCollision(state: VolleyState) {
            if (this.collided > 0) {
                return;
            }
            let netX: number = state.net.pos[0];
            let netY: number = state.net.pos[1] - Net.HEIGHT;

            let xOverlap: boolean = this.pos[0] > netX - this.radius && this.pos[0] < netX + this.radius + Net.THICKNESS;
            let yOverlap: boolean = this.pos[1] > netY - this.radius + 20 && this.pos[1] < state.net.pos[1];

            if (xOverlap && yOverlap) {
                this.speed[0] *= -1;
                this.collided = .1;
            }
        }

        checkWallCollisions(state: VolleyState) {
            //if overlapping floor and moving down
            if (this.pos[1] + this.radius >= state.dimensions[1] && this.speed[1] > 0) {
                this.speed[1] *= -1;
            } //if overlapping ceiling and moving up 
            else if (this.pos[1] - this.radius < 0 && this.speed[1] < 0) {
                this.speed[1] *= -1;
            }

            //if overlapping left wall and moving left
            if (this.pos[0] - this.radius < 0 && this.speed[0] < 0) {
                this.speed[0] *= -1;
            } //if overlapping right wall and moving right
            else if (this.pos[0] + this.radius > state.dimensions[0] && this.speed[0] > 0) {
                this.speed[0] *= -1;
            }            
        }

        //http://vobarian.com/collisions/2dcollisions2.pdf
        collideWith(other: Player) {
            if (this.collided > 0) {
                return; //already handled
            }

            this.collided = .1;

            let m0 = 25, m1 = 100; //masses
            
            let x0 = this.pos[0];
            let y0 = this.pos[1];

            let x1 = other.pos[0];
            let y1 = other.pos[1];
            //1: find unit normal and unit tangent vectors
            let normal = [x1 - x0, y1 - y0];
            let normal_magnitude = this.magnitude(normal);
            let unit_normal = [
                normal[0] / normal_magnitude, 
                normal[1] / normal_magnitude
            ];

            let unit_tangent = [-unit_normal[1], unit_normal[0]];

            //2: create initial velocity vectors
            let v0 = [this.speed[0], this.speed[1]];
            let v1 = [other.speed[0], other.speed[1]];

            //3: calculate scalar velocities in the normal and tangential direction for both
            let scalar_v0_n = this.dotProduct(unit_normal, v0);
            let scalar_v0_t = this.dotProduct(unit_tangent, v0);
            
            let scalar_v1_n = this.dotProduct(unit_normal, v1);
            let scalar_v1_t = this.dotProduct(unit_tangent, v1);

            //4: find the new tangential velocities after collisions
            let post_scalar_v0_t = scalar_v0_t;
            let post_scalar_v1_t = scalar_v1_t;

            //5: find new normal velocities
            let post_scalar_v0_n = this.calculateNormalVelocity(scalar_v0_n, scalar_v1_n, m0, m1);
            let post_scalar_v1_n = this.calculateNormalVelocity(scalar_v1_n, scalar_v0_n, m1, m0);

            //6: convert scalar normal and tangential velocities into vectors
            let post_v0_n = [post_scalar_v0_n * unit_normal[0], post_scalar_v0_n * unit_normal[1]];
            let post_v1_n = [post_scalar_v1_n * unit_normal[0], post_scalar_v1_n * unit_normal[1]];

            let post_v0_t = [post_scalar_v0_t * unit_tangent[0], post_scalar_v0_t * unit_tangent[1]];
            let post_v1_t = [post_scalar_v1_t * unit_tangent[0], post_scalar_v1_t * unit_tangent[1]];

            //7: find final velocity vectors by adding normal and tangential components
            let post_v0 = this.add(post_v0_n, post_v0_t);
            let post_v1 = this.add(post_v1_n, post_v1_t);

            this.speed = [post_v0[0], post_v0[1]];
        }

        add(a: number[], b: number[]): number[] {
            return [a[0] + b[0], a[1] + b[1]];
        }

        magnitude(v: number[]) {
            return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2))
        }

        dotProduct(a: number[], b: number[]) {
            return a[0] * b[0] + a[1] * b[1];
        }

        calculateNormalVelocity(v1n: number, v2n: number, m1: number, m2: number) {
            return (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
        }
    }
}