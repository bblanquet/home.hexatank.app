import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { ICombination } from "./ICombination";
import { ISelectable } from "../../ISelectable";
import { Item } from "../../Items/Item";
import { Ceil } from "../../Ceils/Ceil";
import { BasicField } from "../../Ceils/Field/BasicField";
import { CeilState } from "../../Ceils/CeilState";
import { CombinationContext } from './CombinationContext';
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';

export class SelectionCombination implements ICombination{ 
    private _isSelectable:{(item:Item):boolean};

    constructor(isSelectable:{(item:Item):boolean}){
        this._isSelectable = isSelectable;
    }

    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context) 
        && context.Items.length === 1 
        && this._isSelectable(context.Items[0]);
    }

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            const item = context.Items[0];
            const selectable = this.ToSelectableItem(item);
            if(selectable instanceof Ceil){
                const selectableCeil = selectable as Ceil;
                
                if(selectableCeil.GetField() instanceof BasicField 
                    && selectableCeil.GetState() === CeilState.Visible)
                {
                    selectable.SetSelected(true); 
                    PlaygroundHelper.SelectedItem.trigger(this,item);
                }
                else
                {
                    return false;   
                }
            }
            else
            {
                selectable.SetSelected(true); 
                PlaygroundHelper.SelectedItem.trigger(this,item);
            }
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