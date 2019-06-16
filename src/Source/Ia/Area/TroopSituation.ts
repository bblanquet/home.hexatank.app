import { TroopDecisionMaker } from "./TroopDecisionMaker";
import { TroopDestination } from "./TroopDestination";
import { Ceil } from "../../Ceil";

export class TroopSituation
{
    public Troop:TroopDecisionMaker;
    public Destinations:{ [Danger: number] : Array<TroopDestination>};
    public CurrentDestination:TroopDestination;
    public PotentialNextDestination:TroopDestination;

    constructor(){
        this.Destinations = {};
    }

    public GetBestDestination(excludedArea:Array<Ceil>):TroopDestination{
        const dangerLevels = this.GetDangerLevels();
        let currentIndex = 0;
        var candidates = new Array<TroopDestination>();
        
        while(candidates.length ===0){
            candidates = this.Destinations[dangerLevels[currentIndex]].filter(dest=>!excludedArea.some(e=>e===dest.Destination));
            currentIndex++;
            
            if(currentIndex >= dangerLevels.length)
            {
                return null;
            }
        }
        
        return candidates.sort(this.IsFarther)[0];
    }

    public GetClosestAndSafestPath():TroopDestination{
        return this.Destinations[this.GetDangerLevels()[0]].sort(this.IsFarther)[0];
    }

    private IsFarther(ta:TroopDestination,tb:TroopDestination):number{
        if(ta.GetCost() < tb.GetCost())
        {
            return 1;
        }
        
        if(ta.GetCost() > tb.GetCost())
        {
            return -1;
        }

        return 0;
    }

    private GetDangerLevels():Array<number>{
        var dangers = new Array<number>();
        
        for(let dangerLevel in this.Destinations){
            dangers.push(+dangerLevel);
        }

        return dangers.sort();
    }

}