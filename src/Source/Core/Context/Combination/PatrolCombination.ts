import { ICombination } from "./ICombination";
import { PatrolMenuItem } from "../../Menu/Buttons/PatrolMenuItem"; 
import { PatrolOrder } from "../../Ia/Order/PatrolOrder"; 
import { BasicItem } from "../../Items/BasicItem";
import { Archive } from "../../Utils/ResourceArchiver";
import { Item } from "../../Items/Item";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { Ceil } from "../../Ceils/Ceil";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper"; 
import { IContextContainer } from "../IContextContainer";
import { ISelectable } from "../../ISelectable";

export class PatrolCombination implements ICombination{ 
    private _indicators:Array<BasicItem>;
    private _interactionContext:IContextContainer;

    constructor(interactionContext:IContextContainer){    
        this._interactionContext = interactionContext;
        this._indicators = []; 
    }

    public IsMatching(items: Item[]): boolean 
    { 
        return items.length >= 5
        && items[0] instanceof Vehicle 
        && items[1] instanceof PatrolMenuItem
        && this.IsLastPatrolItem(items); 
    }

    public ContainsVehicleePatrol(items:Item[]):boolean{
        return items.length >= 2
        && items[0] instanceof Vehicle 
        && items[1] instanceof PatrolMenuItem
    }

    public GetCeils(items: Item[]):Array<Ceil>{
        return items.filter(item=>item instanceof Ceil).map(item => <Ceil>item);
    } 

    private IsLastPatrolItem(items: Item[]):boolean{
        return items[items.length-1] instanceof PatrolMenuItem;
    }

    public Combine(items: Item[]): boolean 
    {
        if(this.ContainsVehicleePatrol(items)){
            if(items[items.length-1] instanceof Ceil){
                const element = new BasicItem(items[items.length-1].GetBoundingBox(), Archive.direction.patrol);
                element.SetVisible(()=>true);
                element.SetAlive(()=>true);
                this._indicators.push(element);
                PlaygroundHelper.Playground.Items.push(element);
            }
        }

        if(this.IsMatching(items))
        {
            console.log(`%c PATROL MATCH`,'font-weight:bold;color:blue;');
            var vehicle = <Vehicle>items[0];
            var patrol = new PatrolOrder(this.GetCeils(items),vehicle);
            vehicle.SetOrder(patrol);
            this.UnSelectItem(items[0]);
            this._interactionContext.ClearContext();
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

    private UnSelectItem(item: Item) {            
        var selectable = <ISelectable> <any> (item);
        selectable.SetSelected(false);
    }
}