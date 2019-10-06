import { IItemsManager } from './IItemsManager';
import {Item} from './Items/Item';
import { InputManager } from './Utils/InputManager';
import {InteractionContext} from './Context/InteractionContext';
import { PlaygroundHelper } from './Utils/PlaygroundHelper'; 

export class ItemsManager implements IItemsManager
{    
    Items:Array<Item>;
    public InputManager:InputManager; 

    constructor()
    {
        this.Items = new Array<Item>();
        this.InputManager = new InputManager(new InteractionContext());
        this.InputManager.MouseUpEvent.on(this.Select.bind(this));
    }

    Select(event:InteractionContext):void{
        for (let index = 0; index < this.Items.length; index++) {
            if(this.Items[index].Select(event)){
                return;
            }   
        }
    }

    public Update():void{
        if(!PlaygroundHelper.Settings.IsPause)
        {
            this.Items = this.Items.filter(item => item.IsUpdatable);
            this.Items.forEach(item => {
                item.Update(PlaygroundHelper.Settings.GetX(),PlaygroundHelper.Settings.GetY());
            });
        }
        
    }
} 