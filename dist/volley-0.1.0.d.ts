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
        checkNetCollision(state: VolleyState): void;
        checkWallCollisions(state: VolleyState): void;
        collideWith(other: Player): void;
        add(a: number[], b: number[]): number[];
        magnitude(v: number[]): number;
        dotProduct(a: number[], b: number[]): number;
        calculateNormalVelocity(v1n: number, v2n: number, m1: number, m2: number): number;
    }
}
declare namespace volley {
    enum PlayerDirection {
        Left = 0,
        Right = 1,
    }
    class Player extends ps.Entity implements ps.Collidable {
        color: string;
        keys: string[];
        direction: PlayerDirection;
        accel: number[];
        isJumping: boolean;
        constructor(pos: number[], color: string, radius: number, keys: string[], direction: PlayerDirection);
        render(ctx: CanvasRenderingContext2D, state: VolleyState): void;
        private renderEye(ctx);
        update(dt: number, state: VolleyState): void;
        accelerate(dt: number): void;
        collideWith(other: ps.Collidable): void;
        handleInput(): void;
    }
}
declare namespace volley {
    class Net extends ps.Entity {
        static HEIGHT: number;
        static THICKNESS: number;
        constructor();
        render(ctx: CanvasRenderingContext2D): void;
    }
}
declare namespace volley {
    class NetTop extends ps.Entity implements ps.Collidable {
        static RADIUS: number;
        constructor();
        render(ctx: CanvasRenderingContext2D): void;
        collideWith(other: ps.Collidable): void;
    }
}
declare namespace volley {
    class VolleyState extends ps.BaseGameState {
        dimensions: number[];
        debug: boolean;
        ball: Ball;
        leftPlayer: Player;
        rightPlayer: Player;
        net: Net;
        netTop: NetTop;
        constructor(dimensions: number[], debug: boolean);
        render(ctx: CanvasRenderingContext2D): void;
        update(dt: number): void;
    }
}
declare namespace volley {
}
