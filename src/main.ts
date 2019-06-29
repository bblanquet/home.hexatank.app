import * as PIXI from 'pixi.js';
import {PlaygroundHelper} from './Source/PlaygroundHelper';
import { RenderingHandler } from './Source/RenderingHandler';
import { GroupsContainer } from './Source/GroupsContainer';
import { GameSetup } from './GameSetup';
import { SpriteProvider } from './Source/Tools/SpriteProvider';
import { InteractionContext } from './Source/Context/InteractionContext';
import { Playground } from './Source/Playground';
import { Item } from './Source/Item';
import { LoadingItem } from './Source/LoadingItem';
import { FakeBackground } from './Source/FakeBackground';


const Viewport = require('pixi-viewport').Viewport

const app = new PIXI.Application({
    backgroundColor: 0x00A651,
});

const path = "./Program6.json";
var viewport;

document.addEventListener('DOMContentLoaded', () => { 
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    PIXI.settings.RENDER_OPTIONS.antialias = true;
    document.body.appendChild(app.view);
    app.loader.add(path).load(Setup);
}, false);

function Setup()
{
    PlaygroundHelper.Init();
    PlaygroundHelper.SpriteProvider = new SpriteProvider(app.loader.resources[path].textures);
    
    viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1000,
        worldHeight: 1000,
     
        interaction: app.renderer.plugins.interaction
    });

    app.stage.addChild(viewport);

    viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate();
    
    PlaygroundHelper.Render = new RenderingHandler(
        new GroupsContainer(
            {
                zs:[0,1,2,3,4,5],
                parent:viewport
            },
            {
                zs:[6,7],
                parent:app.stage
            }
            )
        );

    const items = new Array<Item>();
    const playground = new Playground(items,app, interaction);
    PlaygroundHelper.Playground = playground;
    PlaygroundHelper.LoadingPlayground = new Playground(items,app, interaction);

    let manager = new PIXI.interaction.InteractionManager(app.renderer);
    manager.autoPreventDefault = false;
    manager.on('pointerdown', PlaygroundHelper.Playground.InputManager.OnMouseDown.bind(PlaygroundHelper.Playground.InputManager), false);
    manager.on('pointermove', PlaygroundHelper.Playground.InputManager.OnMouseMove.bind(PlaygroundHelper.Playground.InputManager), false);
    manager.on('pointerup', PlaygroundHelper.Playground.InputManager.OnMouseUp.bind(PlaygroundHelper.Playground.InputManager), false);
    // window.addEventListener('mousewheel', PlaygroundHelper.Playground.InputManager.OnMouseWheel.bind(PlaygroundHelper.Playground.InputManager), false);
    window.addEventListener('resize', ResizeTheCanvas);
    ResizeTheCanvas();
    
    PlaygroundHelper.SpriteProvider.PreloadTexture();
    gameSetup.SetGame().forEach(element => {
        PlaygroundHelper.Playground.Items.push(<Item> element);        
    });
    interaction.SetCombination(gameSetup.GetMenus(),gameSetup.GetHq());

    GameLoop();
}

var loading:LoadingItem;
var back:FakeBackground;
var gameSetup = new GameSetup();
const interaction = new InteractionContext();


function ResizeTheCanvas()
{
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
    {
        app.renderer.resize(screen.width,screen.height); 
        Viewport.screenWidth = screen.width;
        Viewport.screenHeight = screen.height;
        PlaygroundHelper.Settings.ScreenWidth = screen.width;
        PlaygroundHelper.Settings.ScreenHeight = screen.height;
    }
    else
    {
        app.renderer.resize(window.innerWidth,window.innerHeight); 
        Viewport.screenWidth = window.innerWidth;
        Viewport.screenHeight = window.innerHeight;
        PlaygroundHelper.Settings.ScreenWidth = window.innerWidth;
        PlaygroundHelper.Settings.ScreenHeight = window.innerHeight;
    }  
}

var times = new Array<number>();

function GameLoop(){
    requestAnimationFrame(GameLoop);
    PlaygroundHelper.Playground.Update();
    SetFps();
}

function SetFps() {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    PlaygroundHelper.Settings.ChangeFps(times.length);
}