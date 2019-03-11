import {Item} from './Item';
import { IPlayground } from './IPlayground';
import { ViewContext } from './ViewContext';
import { InputManager } from './InputManager';
import {InteractionContext} from './Context/InteractionContext';

export class Playground implements IPlayground
{    
    Items:Array<Item>;
    private ViewContext:ViewContext;
    public InputManager:InputManager;
    private _app:PIXI.Application;

    constructor(ceils : Array<Item>, app:PIXI.Application, interactionContext:InteractionContext)
    {
        this._app = app;
        this.Items = ceils;
        this.ViewContext = new ViewContext();
        this.InputManager = new InputManager(this.ViewContext,interactionContext);
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
        this._app.stage.scale.x = this.ViewContext.Zoom;
        this._app.stage.scale.y = this.ViewContext.Zoom;
        this.Items.forEach(item => {
            item.Update(this.ViewContext.BoundingBox.X,this.ViewContext.BoundingBox.Y);
        });
    }
} 