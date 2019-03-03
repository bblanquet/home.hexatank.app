import * as PIXI from 'pixi.js';
import {PlaygroundHelper} from './Source/PlaygroundHelper';
import { RenderingHandler } from './Source/RenderingHandler';
import { GroupsContainer } from './Source/GroupsContainer';
import { GameSetup } from './GameSetup';
import * as Hammer from 'hammerjs';

const app = new PIXI.Application({
    antialias: true,
    forceFXAA: false,
    forceCanvas: false,
    autoResize: true,
    transparent: false,
    backgroundColor: 0x84cb68,
    clearBeforeRender: true,
    preserveDrawingBuffer: false,
    roundPixels: true,
});

const path = "../Resources/Program6.json";

document.addEventListener('DOMContentLoaded', () => {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    document.body.appendChild(app.view);
    app.loader.add(path).load(Setup);
}, false);

function Setup(){
    let textures = app.loader.resources[path].textures;

    PlaygroundHelper.Init();

    PlaygroundHelper.Render = new RenderingHandler(
        new GroupsContainer([0,1,2,3,4],app.stage),textures);

    let gameSetup = new GameSetup();
    gameSetup.SetMap(textures);

    var manager = new PIXI.interaction.InteractionManager(app.renderer);
    manager.autoPreventDefault = false;
    manager.on('pointerdown', PlaygroundHelper.Playground.InputManager.OnMouseDown.bind(PlaygroundHelper.Playground.InputManager), false);
    manager.on('pointermove', PlaygroundHelper.Playground.InputManager.OnMouseMove.bind(PlaygroundHelper.Playground.InputManager), false);
    manager.on('pointerup', PlaygroundHelper.Playground.InputManager.OnMouseUp.bind(PlaygroundHelper.Playground.InputManager), false);
    window.addEventListener('mousewheel', PlaygroundHelper.Playground.InputManager.OnMouseWheel.bind(PlaygroundHelper.Playground.InputManager), false);
    let hammer = new Hammer.Manager(app.view);
    const pinch = new Hammer.Pinch();
    hammer.add([pinch]);
    hammer.on('pinchmove', (event:HammerInput) => {
        PlaygroundHelper.Playground.InputManager.OnPinch(event.scale);
    });

    window.addEventListener('resize', ResizeTheCanvas);
    ResizeTheCanvas();
    GameLoop();
}

function ResizeTheCanvas(){
    console.log(`%c w: ${screen.width} h: ${screen.height}`,'font-weight:bold;color:red;');
    app.renderer.resize(screen.width,screen.height); 
    PlaygroundHelper.Settings.ScreenWidth = screen.width;
    PlaygroundHelper.Settings.ScreenHeight = screen.height;  
}

function GameLoop(){
    requestAnimationFrame(GameLoop);
    PlaygroundHelper.Playground.Update();
}