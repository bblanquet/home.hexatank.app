import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { ICombination } from "./ICombination";
import { ISelectable } from "../../ISelectable";
import { Item } from "../../Items/Item"; 
import { Ceil } from "../../Ceils/Ceil";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { BasicField } from "../../Ceils/Field/BasicField";
import { CeilState } from "../../Ceils/CeilState";
import { IContextContainer } from "../IContextContainer";
import { CombinationContext } from './CombinationContext';
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';

export class UnselectCombination implements ICombination{
    private _isSelectable:{(item:Item):boolean}; 
    private _interactionContext:IContextContainer;

    constructor(isSelectable:{(item:Item):boolean},interactionContext:IContextContainer){
        this._isSelectable = isSelectable;
        this._interactionContext = interactionContext;
    }
    
    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context)
        && context.Items.filter(i=> this._isSelectable(i)).length >=2 && 
        (context.Items.filter(i=> this._isSelectable(i)).length === context.Items.filter(i=> i instanceof Ceil).length
        || context.Items.filter(i=> this._isSelectable(i)).length === context.Items.filter(i=> i instanceof Vehicle).length);
    }    

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.Kind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            const lastItem = context.Items[context.Items.length-1];
            if(this._isSelectable(lastItem))
            {
                if(lastItem === context.Items[0])
                {
                    this.UnSelectItem(context.Items[0]);
                    this._interactionContext.ClearContext();
                    if(lastItem instanceof Vehicle)
                    {
                        const vehicle = lastItem as Vehicle;
                        const ceil = vehicle.GetCurrentCeil();

                        if(ceil.GetField() instanceof BasicField 
                            && ceil.GetState() === CeilState.Visible)
                        {
                            this._interactionContext.Push(ceil,false);
                            ceil.SetSelected(true); 
                            PlaygroundHelper.SelectedItem.trigger(this,ceil);
                            return true;
                        }
                    }
                }
                else
                {
                    this.UnSelectItem(context.Items[0]);
                    this._interactionContext.ClearContext();
                    this._interactionContext.Push(lastItem,true);
                }
            }
            return true;
        }
        return false;
    }

    Clear(): void {
    }
    private UnSelectItem(item: Item) {            
        var selectable = <ISelectable> <any> (item);
        selectable.SetSelected(false);
    }
}