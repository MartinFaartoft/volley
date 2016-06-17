/// <reference path="piston-0.1.1.d.ts" />
/// <reference path="volleystate.ts" />

namespace volley {
    // create canvas
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 768;
    document.body.appendChild(canvas);

    // prepare game state and engine
    let debug = false;
    let dimensions = [canvas.width, canvas.height];
    //let resourceManager: ps.ResourceManager = new ps.ResourceManager();
    let state: VolleyState = new VolleyState(dimensions, debug);
    let engine: ps.Engine = new ps.Engine(state, ctx, debug);

    engine.run();
}