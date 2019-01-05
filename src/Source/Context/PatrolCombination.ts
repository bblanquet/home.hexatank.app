import { ICombination } from "./ICombination";
import { Item } from "../Item";
import { Vehicle } from "../Vehicle";
import { PatrolMenuItem } from "../Menu/PatrolMenuItem";
import { PatrolOrder } from "../Ia/PatrolOrder";
import { Ceil } from "../Ceil";

export class PatrolCombination implements ICombination{
    public IsMatching(items: Item[]): boolean 
    {
        return items.length >= 5
        && items[0] instanceof Vehicle
        && items[1] instanceof PatrolMenuItem
        && this.IsLastPatrolItem(items); 
    }

    public GetCeils(items: Item[]):Array<Ceil>{
        return items.filter(item=>item instanceof Ceil).map(item => <Ceil>item);
    }

    private IsLastPatrolItem(items: Item[]):boolean{
        return items[items.length-1] instanceof PatrolMenuItem;
    }

    public Combine(items: Item[]): void 
    {
        if(this.IsMatching(items))
        {
            console.log(`%c PATROL MATCH`,'font-weight:bold;color:blue;');
            var vehicle = <Vehicle>items[0];
            var patrol = new PatrolOrder(this.GetCeils(items),vehicle);
            vehicle.SetOrder(patrol);
            items.splice(1,items.length-2);
        }
    }


}