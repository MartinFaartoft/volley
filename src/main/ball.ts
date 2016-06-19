/// <reference path="piston-0.2.0.d.ts" />
/// <reference path="volleystate.ts" />


namespace volley {
    export class Ball extends ps.Entity implements ps.Collidable {
        friction: ps.Vector = new ps.Vector(0.0001, .001);
        collided: number = 0;
        mass: number = 25;

        constructor(public pos: ps.Point, speed: ps.Vector, public accel: ps.Vector, radius: number) {
            super(pos, speed, radius);
        }

        render(ctx: CanvasRenderingContext2D, state: VolleyState) {
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
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
            this.speed = this.speed.add(this.accel.multiply(dt));

            //apply friction
            this.speed.x *= 1 - this.friction.x;
            this.speed.y *= 1 - this.friction.y;

            this.pos = this.pos.add(this.speed.multiply(dt));
        }

        checkNetCollision(state: VolleyState) {
            if (this.collided > 0) {
                return;
            }
            let netX: number = state.net.pos.x;
            let netY: number = state.net.pos.y - Net.HEIGHT;

            let xOverlap: boolean = this.pos.x > netX - this.radius && this.pos.x < netX + this.radius + Net.THICKNESS;
            let yOverlap: boolean = this.pos.y > netY - this.radius + 20 && this.pos.y < state.net.pos.y;

            if (xOverlap && yOverlap) {
                this.speed.x *= -1;
                this.collided = .1;
            }
        }

        checkWallCollisions(state: VolleyState) {
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
        }

        //http://vobarian.com/collisions/2dcollisions2.pdf
        collideWith(other: ps.Collidable) {
            if (this.collided > 0) {
                return; //already handled
            }

            this.collided = .1;
            
            let x0 = this.pos.x;
            let y0 = this.pos.y;

            let x1 = other.pos.x;
            let y1 = other.pos.y;

            let pos0 = new ps.Vector(x0, y0);
            let pos1 = new ps.Vector(x1, y1);
            //1: find unit normal and unit tangent vectors
            let v_unit_normal = pos1.subtract(pos0).unit();
            
            let v_unit_tangent = v_unit_normal.tangent();

            //2: create initial velocity vectors
            //already done

            //3: calculate scalar velocities in the normal and tangential direction for both
            let s_v0_n = v_unit_normal.dot(this.speed);
            let s_v0_t = v_unit_tangent.dot(this.speed);
            let s_v1_n = v_unit_normal.dot(other.speed);
            let s_v1_t = v_unit_tangent.dot(other.speed);

            //4: find the new tangential velocities after collisions
            //unchanged, so using previous values (s_v0_t, s_v1_t)

            //5: find new normal velocities
            let p_s_v0_n = this.normalVelocityAfterElasticCollision(s_v0_n, s_v1_n, this.mass, other.mass);
            let p_s_v1_n = this.normalVelocityAfterElasticCollision(s_v1_n, s_v0_n, other.mass, this.mass);

            //6: convert scalar normal and tangential velocities into vectors
            let p_v0_n = v_unit_normal.multiply(p_s_v0_n);
            let p_v1_n = v_unit_normal.multiply(p_s_v1_n);

            let p_v0_t = v_unit_tangent.multiply(s_v0_t);
            let p_v1_t = v_unit_tangent.multiply(s_v1_t);

            //7: find final velocity vectors by adding normal and tangential components
            let p_v0 = p_v0_n.add(p_v0_t);
            let p_v1 = p_v1_n.add(p_v0_t);

            this.speed = p_v0;
        }

        normalVelocityAfterElasticCollision(v1n: number, v2n: number, m1: number, m2: number) {
            return (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
        }
    }
}