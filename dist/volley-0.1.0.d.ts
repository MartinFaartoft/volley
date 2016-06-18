/// <reference path="../src/main/piston-0.1.1.d.ts" />
declare namespace volley {
    class Ball extends ps.Entity implements ps.Collidable {
        pos: number[];
        speed: number[];
        accel: number[];
        friction: number[];
        collided: number;
        constructor(pos: number[], speed: number[], accel: number[], radius: number);
        render(ctx: CanvasRenderingContext2D, state: VolleyState): void;
        update(dt: number, state: VolleyState): void;
        accelerate(dt: number): void;
        checkWallCollisions(state: VolleyState): void;
        collideWith(other: Player): void;
        add(a: number[], b: number[]): number[];
        magnitude(v: number[]): number;
        dotProduct(a: number[], b: number[]): number;
        calculateNormalVelocity(v1n: number, v2n: number, m1: number, m2: number): number;
    }
}
declare namespace volley {
    class Player extends ps.Entity implements ps.Collidable {
        color: string;
        keys: string[];
        accel: number[];
        isJumping: boolean;
        constructor(pos: number[], color: string, radius: number, keys: string[]);
        render(ctx: CanvasRenderingContext2D, state: VolleyState): void;
        update(dt: number, state: VolleyState): void;
        accelerate(dt: number): void;
        collideWith(other: ps.Collidable): void;
        handleInput(): void;
    }
}
declare namespace volley {
    class VolleyState extends ps.BaseGameState {
        dimensions: number[];
        debug: boolean;
        ball: Ball;
        leftPlayer: Player;
        rightPlayer: Player;
        constructor(dimensions: number[], debug: boolean);
        render(ctx: CanvasRenderingContext2D): void;
        update(dt: number): void;
    }
}
declare namespace volley {
}
