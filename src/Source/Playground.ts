import {Item} from './Item';
import { IPlayground } from './IPlayground';
import { ViewContext } from './ViewContext';
import { InputManager } from './InputManager';
import {InteractionContext} from './InteractionContext';

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
        this.Items.every(item => 
        {
            var isSelected = item.Select(event);
            if(isSelected)
            {    
                console.log(`selected: ${item.constructor.name}`,'font-weight:bold;color:red;');
            }
            
            return !isSelected;
        });
    }

    public Update():void{
        this.Items = this.Items.filter(item => item.IsUpdatable);
        this.Items.forEach(item => {
            item.Update(this.ViewContext.BoundingBox.X,this.ViewContext.BoundingBox.Y,this.ViewContext.Zoom);
        });
    }
} 


            //console.log(`%c x: ${event.data.global.x} y: ${event.data.global.y}` ,'color:red;');
