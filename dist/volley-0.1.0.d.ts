/// <reference path="../src/main/piston-0.1.0.d.ts" />
declare namespace volley {
    class Ball extends ps.Entity {
        pos: number[];
        speed: number[];
        accel: number[];
        friction: number[];
        constructor(pos: number[], speed: number[], accel: number[], radius: number);
        render(ctx: CanvasRenderingContext2D, state: VolleyState): void;
        update(dt: number, state: VolleyState): void;
        accelerate(dt: number): void;
        checkCollisions(state: VolleyState): void;
    }
}
declare namespace volley {
    class VolleyState extends ps.BaseGameState {
        dimsensions: number[];
        debug: boolean;
        ball: Ball;
        constructor(dimsensions: number[], debug: boolean);
        render(ctx: CanvasRenderingContext2D): void;
        update(dt: number): void;
    }
}
declare namespace volley {
}
