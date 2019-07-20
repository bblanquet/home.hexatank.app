import * as PIXI from 'pixi.js';
import { GroupsContainer } from './Source/Core/Utils/GroupsContainer';
import { GameSetup } from './Source/Core/GameSetup';
import { SpriteProvider } from './Source/Core/Utils/SpriteProvider';
import { InteractionContext } from './Source/Core/Context/InteractionContext';
import { Playground } from './Source/Core/Playground';
import { PlaygroundHelper } from './Source/Core/Utils/PlaygroundHelper';
import { RenderingHandler } from './Source/Core/Utils/RenderingHandler';
import { Item } from './Source/Core/Items/Item';
const TextInput  = require('pixi-textinput-v5').TextInput;
const Viewport = require('pixi-viewport').Viewport;

const app = new PIXI.Application({
    backgroundColor: 0x00A651,
});

const path = "./Program6.json";
var viewport= new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,
 
    interaction: app.renderer.plugins.interaction
});

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

    var interaction = new InteractionContext();
    const items = new Array<Item>();
    
    PlaygroundHelper.CorePlayground = new Playground(items,app, interaction);
    PlaygroundHelper.MenuPlayground = new Playground(items,app, interaction);
    PlaygroundHelper.CurrentPlayground = PlaygroundHelper.MenuPlayground;

    let manager = new PIXI.interaction.InteractionManager(app.renderer);
    manager.autoPreventDefault = false;
    manager.on('pointerdown', PlaygroundHelper.CorePlayground.InputManager.OnMouseDown.bind(PlaygroundHelper.CorePlayground.InputManager), false);
    manager.on('pointermove', PlaygroundHelper.CorePlayground.InputManager.OnMouseMove.bind(PlaygroundHelper.CorePlayground.InputManager), false);
    manager.on('pointerup', PlaygroundHelper.CorePlayground.InputManager.OnMouseUp.bind(PlaygroundHelper.CorePlayground.InputManager), false);
    window.addEventListener('resize', ResizeTheCanvas);
    ResizeTheCanvas();

    GameLoop();
}

function ResizeTheCanvas()
{
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
    {
        app.renderer.resize(screen.width,screen.height); 
        viewport.screenWidth = screen.width;
        viewport.screenHeight = screen.height;
        viewport.worldWidth = screen.width;
        viewport.worldHeight = screen.height;
        PlaygroundHelper.Settings.ScreenWidth = screen.width;
        PlaygroundHelper.Settings.ScreenHeight = screen.height;
    }
    else
    {
        app.renderer.resize(window.innerWidth,window.innerHeight); 
        viewport.screenWidth = window.innerWidth;
        viewport.screenHeight = window.innerHeight;
        viewport.worldWidth = window.innerWidth;
        viewport.worldHeight = window.innerHeight;
        PlaygroundHelper.Settings.ScreenWidth = window.innerWidth;
        PlaygroundHelper.Settings.ScreenHeight = window.innerHeight;
    }  
}

var times = new Array<number>();

function GameLoop(){
    requestAnimationFrame(GameLoop);
    PlaygroundHelper.CurrentPlayground.Update();
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


    // const input = new TextInput({
	// 	input: {
	// 		fontSize: '36px',
	// 		padding: '12px',
	// 		width: '500px',
	// 		color: '#26272E'
	// 	},
	// 	box: {
	// 		default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
	// 		focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
	// 		disabled: {fill: 0xDBDBDB, rounded: 12}
	// 	}
	// });
	
	// input.placeholder = 'Enter your Text...';
	// input.x = 500;
	// input.y = 300;
	// input.pivot.x = input.width/2;
	// input.pivot.y = input.height/2;
	// app.stage.addChild(input);