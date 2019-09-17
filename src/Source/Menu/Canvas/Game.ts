// import { MapGenerator } from './../../Core/Setup/Generator/MapGenerator';
// import * as  PIXI  from 'pixi.js';
// import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';
// import { SpriteProvider } from '../../Core/Utils/SpriteProvider';
// import { GameSetup } from '../../Core/GameSetup';
// const Viewport = require('pixi-viewport').Viewport;
// const path = "./Program6.json";

// const app= new PIXI.Application({
//     backgroundColor: 0x00A651,//0x6d9ae3
// });

// const viewport= new Viewport({
//     screenWidth: window.innerWidth,
//     screenHeight: window.innerHeight,
//     worldWidth: 2000,
//     worldHeight: 1000,
//     interaction: app.renderer.plugins.interaction
// });

// const gameSetup= new GameSetup();

// (function() {document.addEventListener('DOMContentLoaded', (event) => {
//         PlaygroundHelper.MapContext = new MapGenerator().GetMapDefinition(3);
//         PlaygroundHelper.SetDefaultName();
//         PlaygroundHelper.MapContext.Hqs[0].PlayerName = PlaygroundHelper.PlayerName;
//         PlaygroundHelper.MapContext.Hqs.forEach(hq => {
//             if (!hq.PlayerName) {
//                 hq.isIa = true;
//             }
//         });
//     PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
//     PIXI.settings.RENDER_OPTIONS.antialias = true;
//     app.loader.add(path).load(Setup);
//     document.body.appendChild(app.view);
//     app.start();
// });})

// function Setup()
// {
//     let manager = new PIXI.interaction.InteractionManager(app.renderer);
//     PlaygroundHelper.SpriteProvider = new SpriteProvider(app.loader.resources[path].textures);
//     app.stage.addChild(viewport);
//     viewport.drag().pinch().wheel().decelerate();
//     gameSetup.SetGame(app.stage,viewport);
//     manager.autoPreventDefault = false;
//     manager.on('pointerdown', PlaygroundHelper.Playground.InputManager.OnMouseDown.bind(PlaygroundHelper.Playground.InputManager), false);
//     manager.on('pointermove', PlaygroundHelper.Playground.InputManager.OnMouseMove.bind(PlaygroundHelper.Playground.InputManager), false);
//     manager.on('pointerup', PlaygroundHelper.Playground.InputManager.OnMouseUp.bind(PlaygroundHelper.Playground.InputManager), false);
//     window.addEventListener('resize', ResizeTheCanvas);
//     window.addEventListener('DOMContentLoaded',ResizeTheCanvas);
//     ResizeTheCanvas();
//     GameLoop();
// }

// function GameLoop(){
//     PlaygroundHelper.Playground.Update();
//     this._app.renderer.render(this._app.stage);
//     requestAnimationFrame(GameLoop);
//  }

// function ResizeTheCanvas()
// {
//     if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
//     {
//         this._app.renderer.resize(screen.width,screen.height); 
//         this._viewport.screenWidth = screen.width;
//         this._viewport.screenHeight = screen.height;
//         this._viewport.worldWidth = screen.width;
//         this._viewport.worldHeight = screen.height;
//         PlaygroundHelper.Settings.ScreenWidth = screen.width;
//         PlaygroundHelper.Settings.ScreenHeight = screen.height;
//     }
//     else
//     {
//         this._app.renderer.resize(window.innerWidth,window.innerHeight); 
//         this._viewport.screenWidth = window.innerWidth;
//         this._viewport.screenHeight = window.innerHeight;
//         this._viewport.worldWidth = window.innerWidth;
//         this._viewport.worldHeight = window.innerHeight;
//         PlaygroundHelper.Settings.ScreenWidth = window.innerWidth;
//         PlaygroundHelper.Settings.ScreenHeight = window.innerHeight;
//     }

//     if(this._isFirstResize){
//       this._isFirstResize = false;
//       this._gameSetup.SetCenter();
//     }
// }