import * as PIXI from 'pixi.js';
import {PlaygroundHelper} from './Source/PlaygroundHelper';
import { RenderingHandler } from './Source/RenderingHandler';
import { GroupsContainer } from './Source/GroupsContainer';
import { GameSetup } from './GameSetup';
import * as Hammer from 'hammerjs';
import { SpriteProvider } from './Source/Tools/SpriteProvider';

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

const path = "./Program6.json";

document.addEventListener('DOMContentLoaded', () => {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    document.body.appendChild(app.view);
    app.loader.add(path).load(Setup);
}, false);

function Setup()
{
    PlaygroundHelper.Init();
    PlaygroundHelper.SpriteProvider = new SpriteProvider(['./Cell.svg'],app.loader.resources[path].textures);
    PlaygroundHelper.Render = new RenderingHandler(
        new GroupsContainer([0,1,2,3,4],app.stage));

    let gameSetup = new GameSetup();
    gameSetup.SetMap();

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
    app.renderer.resize(screen.width,screen.height); 
    PlaygroundHelper.Settings.ScreenWidth = screen.width;
    PlaygroundHelper.Settings.ScreenHeight = screen.height;  
}

function GameLoop(){
    requestAnimationFrame(GameLoop);
    PlaygroundHelper.Playground.Update();
}