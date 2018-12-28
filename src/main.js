import * as PIXI from 'pixi.js';
import { Playground } from './Source/Playground';
import { PlaygroundBuilder } from './Source/PlaygroundBuilder';
import { VehicleFactory } from './Source/VehicleFactory';
import { CeilDecorator } from './Source/CeilDecorator';
import { PlaygroundHelper } from './Source/PlaygroundHelper';
import { RenderingHandler } from './Source/RenderingHandler';
import { GroupsContainer } from './Source/GroupsContainer';
import { Diamond } from './Source/Diamond';
import { Headquarter } from './Source/Headquarter';
const app = new PIXI.Application({ width: 480, height: 800 });
let playground;
document.addEventListener('DOMContentLoaded', () => {
    app.renderer.backgroundColor = 0xe5d300;
    document.body.appendChild(app.view);
    app.loader.resources;
    app.loader.add("../Resources/Program6.json").load(Setup);
}, false);
function Setup() {
    let items = new Array();
    let textures = app.loader.resources["../Resources/Program6.json"].textures;
    PlaygroundHelper.Init();
    var container = new PIXI.Container();
    app.stage.addChild(container);
    PlaygroundHelper.Render = new RenderingHandler(new GroupsContainer([0, 1, 2, 3], app.stage), textures);
    let playgroundMaker = new PlaygroundBuilder(4);
    playgroundMaker.Build().forEach(ceil => {
        ceil.Decorate(textures);
        CeilDecorator.Decorate(ceil, textures);
        PlaygroundHelper.CeilsContainer.Add(ceil);
        items.push(ceil);
    });
    var vehicles = new Array();
    vehicles.push(VehicleFactory.GetTank(items[0]));
    vehicles.push(VehicleFactory.GetTank(items[3]));
    vehicles.push(VehicleFactory.GetTruck(items[23]));
    items.push(vehicles[0]);
    items.push(vehicles[1]);
    items.push(vehicles[2]);
    var headquarter = new Headquarter(items[40]);
    items.push(headquarter);
    let diamond = new Diamond(items[15]);
    items.push(diamond);
    PlaygroundHelper.Vehicles = vehicles;
    items.forEach(item => {
        PlaygroundHelper.Render.Add(item);
    });
    playground = new Playground(items);
    var manager = new PIXI.interaction.InteractionManager(app.renderer);
    manager.on('mousedown', playground.InputManager.OnMouseDown.bind(playground.InputManager), false);
    manager.on('mousemove', playground.InputManager.OnMouseMove.bind(playground.InputManager), false);
    manager.on('mouseup', playground.InputManager.OnMouseUp.bind(playground.InputManager), false);
    window.addEventListener('mousewheel', playground.InputManager.OnMouseWheel.bind(playground.InputManager), false);
    GameLoop();
}
function GameLoop() {
    requestAnimationFrame(GameLoop);
    playground.Update();
}
//# sourceMappingURL=main.js.map