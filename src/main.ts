import * as PIXI from 'pixi.js';
import { Playground } from './Source/Playground';
import { PlaygroundBuilder } from './Source/PlaygroundBuilder';
import {Item} from './Source/Item';
import {VehicleFactory} from './Source/VehicleFactory';
import {Ceil} from './Source/Ceil';
import {CeilDecorator} from './Source/CeilDecorator';
import {PlaygroundHelper} from './Source/PlaygroundHelper';
import * as data from './Resources/Program6.json';
import { RenderingHandler } from './Source/RenderingHandler';
import { GroupsContainer } from './Source/GroupsContainer';
import { Vehicle } from './Source/Vehicle';
import { Diamond } from './Source/Diamond';
import { Headquarter } from './Source/Headquarter';
import { Menu } from './Source/Menu/Menu';
import { TankMenuItem } from './Source/Menu/TankMenuItem';
import { BottomMenu } from './Source/Menu/BottomMenu';
import { RockField } from './Source/RockField';

const app = new PIXI.Application({width: 480, height: 800});
let playground:Playground;

document.addEventListener('DOMContentLoaded', () => {
    app.renderer.backgroundColor = 0xe5d300;
    document.body.appendChild(app.view);
    app.loader.resources
    app.loader.add("../Resources/Program6.json").load(Setup);
}, false);

function Setup(){
    let items = new Array<Item>();
    let textures = app.loader.resources["../Resources/Program6.json"].textures;
    PlaygroundHelper.Init();

    var container = new PIXI.Container();

    app.stage.addChild(container);

    PlaygroundHelper.Settings.ScreenWidth = 480;
    PlaygroundHelper.Settings.ScreenHeight = 800;

    PlaygroundHelper.Render = new RenderingHandler(
        new GroupsContainer([0,1,2,3],app.stage),textures);

    let playgroundMaker = new PlaygroundBuilder(6);
    var ceils = playgroundMaker.Build();
    ceils.forEach(ceil=>
    {
        ceil.Decorate(textures);
        CeilDecorator.Decorate(items, ceil,textures);
        PlaygroundHelper.CeilsContainer.Add(ceil);
        items.push(ceil);
    });        

    var vehicles = new Array<Vehicle>();

    vehicles.push(VehicleFactory.GetTank(<Ceil> ceils[0]));
    vehicles.push(VehicleFactory.GetTank(<Ceil> ceils[3]));
    vehicles.push(VehicleFactory.GetTruck(<Ceil> ceils[23]));
    

    CleanCeil(ceils,0);
    CleanCeil(ceils,1);
    CleanCeil(ceils,2);
    items.push(vehicles[0]);
    items.push(vehicles[1]);
    items.push(vehicles[2]);
    
    CleanCeil(ceils,40);
    var headquarter = new Headquarter((<Ceil> ceils[40]));
    items.push(headquarter);

    CleanCeil(ceils,15);
    let diamond = new Diamond(<Ceil> ceils[15]);
    items.push(diamond);

    var menu = new Menu([new TankMenuItem(headquarter,'tankIcon','tankIcon')]);
    items.splice(0,0,menu);

    PlaygroundHelper.Vehicles = vehicles;

    var bottomMenu = new BottomMenu(headquarter);

    items.splice(0,0,bottomMenu);

    items.forEach(item=>{
        PlaygroundHelper.Render.Add(item);
    });

    playground = new Playground(items);
    PlaygroundHelper.Playground = playground;
    var manager = new PIXI.interaction.InteractionManager(app.renderer);
    manager.on('mousedown', playground.InputManager.OnMouseDown.bind(playground.InputManager), false);
    manager.on('mousemove', playground.InputManager.OnMouseMove.bind(playground.InputManager), false);
    manager.on('mouseup', playground.InputManager.OnMouseUp.bind(playground.InputManager), false);
    window.addEventListener('mousewheel', playground.InputManager.OnMouseWheel.bind(playground.InputManager), false);
    GameLoop();
}

function CleanCeil(ceils:Ceil[], i:number):void{
    var rockfield = ceils[i].Field as RockField;
    if(rockfield != null)
    {
        rockfield.Destroy();
        ceils[i].Field = null;
    }
}

function GameLoop(){
    requestAnimationFrame(GameLoop);
    playground.Update();
}