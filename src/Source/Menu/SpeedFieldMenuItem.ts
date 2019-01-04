import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../InteractionContext";
import { Item } from "../Item";
import { Ceil } from "../Ceil";
import { isNullOrUndefined } from "util";
import { FastField } from "../FastField";
import { Playground } from "../Playground";
import { PlaygroundHelper } from "../PlaygroundHelper";

export class SpeedFieldMenuItem extends MenuItem{
    protected SelectionFunc:any;
    
    constructor(){
        super('speedCeilIcon','speedCeilIcon');
        this.SelectionFunc = this.Selected.bind(this);
    }
    
    private Selected(obj:any, item:Item):void
    {
        let ceil = item as Ceil;
        let interaction = <InteractionContext> obj;
        if(!isNullOrUndefined(ceil))
        {
            let field = new FastField(ceil);
            PlaygroundHelper.Playground.Items.push(field);
            interaction.SelectionEvent.off(this.SelectionFunc);
        }
    }

    public Select(context: InteractionContext): boolean {
        context.SelectionEvent.on(this.SelectionFunc);
        return true;
    }

}