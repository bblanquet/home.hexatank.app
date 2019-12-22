import { GameSettings } from './Utils/GameSettings';
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
        event.OnSelect(null);
    }

    public Update():void{
        if(!GameSettings.IsPause)
        {
            this.Items = this.Items.filter(item => item.IsUpdatable);
            this.Items.forEach(item => {
                item.Update(PlaygroundHelper.ScaleHandler.GetX(),PlaygroundHelper.ScaleHandler.GetY());
            });
        }
        
    }
} 