import * as PIXI from 'pixi.js';
import { Playground } from './Source/Playground';
import { PlaygroundBuilder } from './Source/PlaygroundBuilder';
import {Item} from './Source/Item';
import {Ceil} from './Source/Ceil';
import {CeilDecorator} from './Source/CeilDecorator';
import {PlaygroundHelper} from './Source/PlaygroundHelper';
import * as data from './Resources/Program6.json';
import { RenderingHandler } from './Source/RenderingHandler';
import { GroupsContainer } from './Source/GroupsContainer';
import { Diamond } from './Source/Field/Diamond';
import { Headquarter } from './Source/Field/Headquarter';
import { TankMenuItem } from './Source/Menu/TankMenuItem';
import { BottomMenu } from './Source/Menu/BottomMenu';
import { HqSkin } from './Source/HqSkin';
import { RightMenu } from './Source/Menu/RightMenu';
import { LeftMenu } from './Source/Menu/LeftMenu';
import { AttackMenuItem } from './Source/Menu/AttackMenuItem';
import { PatrolMenuItem } from './Source/Menu/PatrolMenuItem';
import { TruckMenuItem } from './Source/Menu/TruckMenuItem';
import { SpeedFieldMenuItem } from './Source/Menu/SpeedFieldMenuItem';
import { CancelMenuItem } from './Source/Menu/CancelMenuItem';
import { SmartHq } from './Source/Ia/SmartHq';
import { EmptyMenuItem } from './Source/Menu/EmptyMenuItem';
import { HealMenuItem } from './Source/Menu/HealMenuItem';
import { Cloud } from './Source/Cloud';
import { BoundingBox } from './Source/BoundingBox';

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
        new GroupsContainer([0,1,2,3,4],app.stage),textures);

    let playgroundMaker = new PlaygroundBuilder(6);
    var ceils = playgroundMaker.Build();
    ceils.forEach(ceil=>
    {
        CeilDecorator.Decorate(items, ceil,textures);
        ceil.SetSprite(textures);
        PlaygroundHelper.CeilsContainer.Add(ceil);
        items.push(ceil);
    });        
    
    let diamond = new Diamond(<Ceil> ceils[15]);
    items.push(diamond);

    var redQuarter = new Headquarter(new HqSkin("redBottomTank","redTopTank","redTruck","redHqLight","redCeil"),(<Ceil> ceils[40]));
    var blueQuarter = new SmartHq(PlaygroundHelper.GetAreas(<Ceil> ceils[60]),
    new HqSkin("blueBottomTank","blueTopTank","blueTruck","blueHqLight","selectedCeil"),(<Ceil> ceils[60]));
    blueQuarter.Diamond = diamond;

    var brownQuarter = new SmartHq(PlaygroundHelper.GetAreas(<Ceil> ceils[75])
    ,new HqSkin("brownBottomTank","brownTopTank","brownTruck","brownHqLight","brownCeil"),(<Ceil> ceils[75]));
    brownQuarter.Diamond = diamond;

    items.push(redQuarter);
    items.push(blueQuarter);
    items.push(brownQuarter);

    var rightMenu = new RightMenu(
        [new EmptyMenuItem('rightTopBorder','rightTopBorder'),
        new TankMenuItem(redQuarter),
        new TruckMenuItem(redQuarter),
        new HealMenuItem(),
        new AttackMenuItem(),
        new SpeedFieldMenuItem(),
        new EmptyMenuItem('rightBottomBorder','rightBottomBorder')]);    
    items.splice(0,0,rightMenu);

    var leftMenu = new LeftMenu(
        [new EmptyMenuItem('leftTopBorder','leftTopBorder'),
        new EmptyMenuItem('attackIcon','hoverAttackIcon'),
        new EmptyMenuItem('defenseIcon','hoverDefenseIcon'),
        new PatrolMenuItem(),
        new CancelMenuItem(),
        new EmptyMenuItem('leftBottomBorder','leftBottomBorder')]);

    items.splice(0,0,leftMenu);
    
    var bottomMenu = new BottomMenu(redQuarter);

    items.splice(0,0,bottomMenu);

    items.forEach(item=>{
        PlaygroundHelper.Render.Add(item);
    });
    
    items.push(new Cloud(200,12*PlaygroundHelper.Settings.Size,600,'cloud'));
    items.push(new Cloud(60,12*PlaygroundHelper.Settings.Size,200,'cloud2'));
    items.push(new Cloud(0,12*PlaygroundHelper.Settings.Size,800,'cloud3'));

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