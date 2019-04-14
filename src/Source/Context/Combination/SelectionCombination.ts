import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { ISelectable } from "../../ISelectable";
import { Menu } from "../../Menu/Menu";

export class SelectionCombination implements ICombination{
    private _isSelectable:{(item:Item):boolean};

    constructor(private _menus:Menu[],isSelectable:{(item:Item):boolean}){
        this._isSelectable = isSelectable;
    }

    IsMatching(items: Item[]): boolean {
        return items.length === 1 && this._isSelectable(items[0]);
    }

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items)){
            const item = items[0];
            const selectable = this.ToSelectableItem(item);
            selectable.SetSelected(true); 
            this._menus.forEach(menu=>{menu.Show(selectable);});
            return true;   
        }
        return false;
    }

    private IsSelectableItem(item: any):item is ISelectable{
        return 'SetSelected' in item;
    }

    private ToSelectableItem(item: any):ISelectable{
        if(this.IsSelectableItem(item)){
            return <ISelectable> item;
        }
        return null;
    }

    Clear(): void {
    }
}