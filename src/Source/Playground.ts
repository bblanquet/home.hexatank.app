import {Item} from './Item';
import { IPlayground } from './IPlayground';
import { InputManager } from './InputManager';
import {InteractionContext} from './Context/InteractionContext';
import { PlaygroundHelper } from './PlaygroundHelper';

export class Playground implements IPlayground
{    
    Items:Array<Item>;
    public InputManager:InputManager;
    private _app:PIXI.Application;

    constructor(ceils : Array<Item>, app:PIXI.Application, interactionContext:InteractionContext)
    {
        this._app = app;
        this.Items = ceils;
        this.InputManager = new InputManager(interactionContext);
        this.InputManager.DownEvent.on(this.Select.bind(this));
    }

    Select(event:InteractionContext):void{
        for (let index = 0; index < this.Items.length; index++) {
            if(this.Items[index].Select(event)){
                return;
            }   
        }
    }

    public Update():void{
        this.Items = this.Items.filter(item => item.IsUpdatable);
        //this._app.stage.scale.x = PlaygroundHelper.Settings.GetScale();
        //this._app.stage.scale.y = PlaygroundHelper.Settings.GetScale();
        this.Items.forEach(item => {
            item.Update(PlaygroundHelper.Settings.GetX(),PlaygroundHelper.Settings.GetY());
        });
    }
} 