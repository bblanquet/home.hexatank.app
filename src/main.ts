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
import { HqSkin } from './Source/HqSkin';
import { RightMenu } from './Source/Menu/RightMenu';
import { LeftMenu } from './Source/Menu/LeftMenu';
import { AttackMenuItem } from './Source/Menu/AttackMenuItem';
import { PatrolMenuItem } from './Source/Menu/PatrolMenuItem';
import { TruckMenuItem } from './Source/Menu/TruckMenuItem';
import { SpeedFieldMenuItem } from './Source/Menu/SpeedFieldMenuItem';
import { isNullOrUndefined } from 'util';
import { CancelMenuItem } from './Source/Menu/CancelMenuItem';
import { SmartHq } from './Source/Ia/SmartHq';

const app = new PIXI.Application({width: 480, height: 800});
let playground:Playground;

document.addEventListener('DOMContentLoaded', () => {
    app.renderer.backgroundColor = 0x84cb68;
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
        CeilDecorator.Decorate(items, ceil,textures);
        ceil.SetSprite(textures);
        PlaygroundHelper.CeilsContainer.Add(ceil);
        items.push(ceil);
    });        
    
    var redQuarter = new Headquarter(new HqSkin("redBottomTank","redTopTank","redTruck","redHqLight"),(<Ceil> ceils[40]));
    var blueQuarter = new SmartHq(PlaygroundHelper.GetAreas(<Ceil> ceils[60]),new HqSkin("blueBottomTank","blueTopTank","blueTruck","blueHqLight"),(<Ceil> ceils[60]));

    items.push(redQuarter);
    items.push(blueQuarter);

    //var vehicles = new Array<Vehicle>();
    //vehicles.push(VehicleFactory.GetTank(<Ceil> ceils[0],redQuarter));
    //vehicles.push(VehicleFactory.GetTank(<Ceil> ceils[3],blueQuarter));
    //vehicles.push(VehicleFactory.GetTruck(<Ceil> ceils[23],blueQuarter));

    //items.push(vehicles[0]);
    //items.push(vehicles[1]);
    //items.push(vehicles[2]);

    let diamond = new Diamond(<Ceil> ceils[15]);
    items.push(diamond);

    var rightMenu = new RightMenu(
        [new AttackMenuItem('rightTopBorder','rightTopBorder'),
        new TankMenuItem(redQuarter),
        new TruckMenuItem(redQuarter),
        new AttackMenuItem('attackCeilIcon','attackCeilIcon'),
        new AttackMenuItem('healCeilIcon','healCeilIcon'),
        new SpeedFieldMenuItem(),
        new AttackMenuItem('rightBottomBorder','rightBottomBorder')]);    
    items.push(rightMenu);

    var leftMenu = new LeftMenu(
        [new AttackMenuItem('leftTopBorder','leftTopBorder'),
        new AttackMenuItem('attackIcon','hoverAttackIcon'),
        new AttackMenuItem('defenseIcon','hoverDefenseIcon'),
        new PatrolMenuItem(),
        new CancelMenuItem(),
        new AttackMenuItem('leftBottomBorder','leftBottomBorder')]);

    items.push(leftMenu);

    //vehicles.forEach(vehicle=>{
    //    PlaygroundHelper.Add(vehicle);
    //});
    
    var bottomMenu = new BottomMenu(redQuarter);

    items.push(bottomMenu);

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

function GameLoop(){
    requestAnimationFrame(GameLoop);
    playground.Update();
}