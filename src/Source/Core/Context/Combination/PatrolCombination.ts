import { ICombination } from "./ICombination";
import { PatrolMenuItem } from "../../Menu/Buttons/PatrolMenuItem"; 
import { PatrolOrder } from "../../Ia/Order/PatrolOrder"; 
import { BasicItem } from "../../Items/BasicItem";
import { Archive } from "../../Utils/ResourceArchiver";
import { Item } from "../../Items/Item";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { Ceil } from "../../Ceils/Ceil";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper"; 
import { CombinationContext } from "./CombinationContext";
import { ContextMode } from "../../Utils/ContextMode";
import { InteractionKind } from "../IInteractionContext";

export class PatrolCombination implements ICombination{ 
    private _indicators:Array<BasicItem>;

    constructor(){    
        this._indicators = []; 
    }

    public IsMatching(context: CombinationContext): boolean 
    { 
        return this.IsNormalMode(context)
        && context.Items.length >= 5
        && context.Items[0] instanceof Vehicle 
        && context.Items[1] instanceof PatrolMenuItem
        && this.IsLastPatrolItem(context.Items); 
    }

    public ContainsVehicleePatrol(context:CombinationContext):boolean{
        return context.Items.length >= 2
        && context.Items[0] instanceof Vehicle 
        && context.Items[1] instanceof PatrolMenuItem
    }

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.Kind === InteractionKind.Up;
    }

    public GetCeils(items: Item[]):Array<Ceil>{
        return items.filter(item=>item instanceof Ceil).map(item => <Ceil>item);
    } 

    private IsLastPatrolItem(items: Item[]):boolean{
        return items[items.length-1] instanceof PatrolMenuItem;
    }

    public Combine(context: CombinationContext): boolean 
    {
        if(this.ContainsVehicleePatrol(context)){
            if(context.Items[context.Items.length-1] instanceof Ceil){
                const element = new BasicItem(context.Items[context.Items.length-1].GetBoundingBox(), Archive.direction.patrol);
                element.SetVisible(()=>true);
                element.SetAlive(()=>true);
                this._indicators.push(element);
                PlaygroundHelper.Playground.Items.push(element);
            }
        }

        if(this.IsMatching(context))
        {
            console.log(`%c PATROL MATCH`,'font-weight:bold;color:blue;');
            var vehicle = <Vehicle>context.Items[0];
            var patrol = new PatrolOrder(this.GetCeils(context.Items),vehicle);
            vehicle.SetOrder(patrol);
            context.Items.splice(1,1);
            return true;
        }
        return false;
    }

    Clear(): void {
        this._indicators.forEach(indicator=>{
            indicator.Destroy();
        })
        this._indicators = [];
    }
}