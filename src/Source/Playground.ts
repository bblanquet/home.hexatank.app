import {Item} from './Item';
import { IPlayground } from './IPlayground';
import { ViewContext } from './ViewContext';
import { InputManager } from './InputManager';
import {InteractionContext} from './Context/InteractionContext';

export class Playground implements IPlayground
{    
    Items:Array<Item>;
    ViewContext:ViewContext;
    InputManager:InputManager;

    constructor(ceils : Array<Item>)
    {
        this.Items = ceils;
        this.ViewContext = new ViewContext();
        this.InputManager = new InputManager(this.ViewContext);
        this.InputManager.DownEvent.on(this.Select.bind(this));
    }

    Select(event:InteractionContext):void{
        for (let index = this.Items.length-1; -1 < index; index--) {
            if(this.Items[index].Select(event)){
                return;
            }   
        }
    }

    public Update():void{
        this.Items = this.Items.filter(item => item.IsUpdatable);
        this.Items.forEach(item => {
            item.Update(this.ViewContext.BoundingBox.X,this.ViewContext.BoundingBox.Y,this.ViewContext.Zoom);
        });
    }
} 