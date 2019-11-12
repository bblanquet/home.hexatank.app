import { IItemsManager } from './IItemsManager';
import {Item} from './Items/Item';
import { PlaygroundHelper } from './Utils/PlaygroundHelper'; 
import { IInteractionContext } from './Context/IInteractionContext';

export class ItemsManager implements IItemsManager
{    
    Items:Array<Item>;

    constructor()
    {
        this.Items = new Array<Item>();
    }

    public Select(event:IInteractionContext):void{
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