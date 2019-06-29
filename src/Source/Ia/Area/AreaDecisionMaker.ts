import { HeldArea } from "./HeldArea";
import { PlaygroundHelper } from "../../PlaygroundHelper"; 
import { Ceil } from "../../Ceils/Ceil";
import { isNullOrUndefined } from "util";
import { TroopSituation } from "./TroopSituation";
import { TroopDestination } from "./TroopDestination";
import { Tank } from "../../Unit/Tank";
import { Area } from "./Area";
import { SimpleOrder } from "../Order/SimpleOrder";

export class AreaDecisionMaker
{
    constructor(private _area:HeldArea){
    }

    public Update():void {
        this.Do();
    }


    private Do():void{
        if(this._area.GetTroops().length > 0)
        {
            console.log(`%c [ALERT] troops count ${this._area.GetTroops().length}`,"font-weight:bold;color:red;");
            const ally = this._area.GetTroops()[0].Tank;


            console.log(`%c troops count ${this._area.GetTroops().length}`,"font-weight:bold;color:green;");
    
            //#1 get in & out ceils
            const areas = PlaygroundHelper.GetNeighbourhoodAreas(this._area.GetCentralCeil());
            areas.push(this._area.GetArea());
            
            //#2 get enemies ceils
            const enemyCeils = this.GetEnemyCeils(areas, ally);
    
            console.log(`%c enemy ceils count ${enemyCeils.length}`,"font-weight:bold;color:blue;");
    
            //#3 get enemy contact ceils
            const surroundingEnemyCeils = this.GetSurroundingEnemyCeils(enemyCeils);
            
            console.log(`%c surrounding enemy ceils count ${Object.keys(surroundingEnemyCeils).length}`,"font-weight:bold;color:red;");
    
            //#4 classify ceil dangerous
            const dangerLevelCeils = this.ClassifyCeilDanger(surroundingEnemyCeils, ally);
    
            for(let danger in dangerLevelCeils)
            {
                console.log(`%c danger lvl ${danger} - ceils count ${Object.keys(dangerLevelCeils[danger]).length}`,"font-weight:bold;color:brown;");
            }
    
            //#5 find path to reach ceils and classify them
            let troopSituations = new Array<TroopSituation>();
            this.FindTroopPaths(troopSituations, dangerLevelCeils);

            troopSituations = troopSituations.filter(t=>Object.keys(t.Destinations).length > 0);

            //#6 select path
            const currentDestTroops = this.SelectBestPaths(troopSituations);
    
            if(isNullOrUndefined(currentDestTroops)){
                return;
            }


            //#7 give orders to units
            for(let key in currentDestTroops){
                currentDestTroops[key].forEach(troopSituation => {
                    console.log(`%c tank get order to go to ${troopSituation.CurrentDestination.Destination.GetCoordinate().ToString()}`,"font-weight:bold;color:red;");
                    troopSituation.Troop.Tank.SetOrder(
                        new SimpleOrder(troopSituation.CurrentDestination.Destination,troopSituation.Troop.Tank));
                });
            }
        }
    }

    private GetSurroundingEnemyCeils(enemyCeils:Array<Ceil>)
    {
        const enemyContactCeils : { [id: string] : Ceil; } = {};
        enemyCeils.forEach(enemyCeil=>
        {
            enemyCeil.GetNeighbourhood().forEach(ceil=>
            {
                if(!enemyContactCeils.hasOwnProperty(ceil.GetCoordinate().ToString()))
                {
                    enemyContactCeils[ceil.GetCoordinate().ToString()] = ceil as Ceil;
                }
            })
        });
        return enemyContactCeils;
    }


    private ClassifyCeilDanger(enemySurroundingCeils: { [id: string]: Ceil; }, ally: Tank) 
    : { [id: number] : { [id: string] : Ceil; }; }
    {
        var dangerLevelCeils : { [id: number] : { [id: string] : Ceil; }; } = {};
        
        for (let key in enemySurroundingCeils) 
        {
            const currentCeil = enemySurroundingCeils[key];
            const ceilKey = currentCeil.GetCoordinate().ToString();
            const dangerLevel = currentCeil
                .GetAllNeighbourhood()
                .map(c => c as Ceil)
                .filter(c => !isNullOrUndefined(c) && c.ContainsEnemy(ally)).length;
            

            if (!dangerLevelCeils.hasOwnProperty(dangerLevel)) 
            {
                dangerLevelCeils[dangerLevel] = {};
            }

            if (!dangerLevelCeils[dangerLevel].hasOwnProperty(ceilKey)) 
            {
                dangerLevelCeils[dangerLevel][ceilKey] = currentCeil;
            }
        }
        return dangerLevelCeils;
    }

    private SelectBestPaths(troopSituations: TroopSituation[]) 
    : { [ceilKey: string]: TroopSituation[]; }
    {
        this.SetTroopDestination(troopSituations);
        let unresolvedCases = 0;
        var hasConflicts = true;
        const excludedCeils : { [id: string] : Ceil; } = {};
        while (hasConflicts) 
        {
            if(unresolvedCases === 4){
                return null;
            }

            unresolvedCases++;
            hasConflicts = false;
            var troopsByDest = this.GetTroopsByDest(troopSituations);
            for (const dest in troopsByDest) 
            {
                if (troopsByDest[dest].length > 1) 
                {
                    excludedCeils[dest] = troopsByDest[dest][0].CurrentDestination.Destination;

                    let ceils = new Array<Ceil>();
                    for (var prop in excludedCeils) 
                    {
                        ceils.push(excludedCeils[prop]);
                    }

                    this.ResolveConflicts(troopsByDest[dest], ceils);
                }
            }
            troopsByDest = this.GetTroopsByDest(troopSituations);
            for (const dest in troopsByDest) {if (troopsByDest[dest].length > 1) {hasConflicts = true;}}
        }

        return troopsByDest;
    }

    private SetTroopDestination(troopSituations: TroopSituation[]):void{
        troopSituations.forEach(troopSituation => {
            troopSituation.CurrentDestination = troopSituation.GetClosestAndSafestPath();
        });
    }

    private GetTroopsByDest(troopSituations: TroopSituation[])
    :{ [ceilKey: string]: TroopSituation[]; } {

        var currentDestTroops: { [ceilKey: string]: TroopSituation[]; }={};

        troopSituations.forEach(troopSituation => {
            const key = troopSituation.CurrentDestination.Destination.GetCoordinate().ToString();
            if (!currentDestTroops.hasOwnProperty(key)) {
                currentDestTroops[key] = new Array<TroopSituation>();
            }
            currentDestTroops[key].push(troopSituation);
        });
        return currentDestTroops;
    }

    private FindTroopPaths(troopSituations: TroopSituation[], dangerLevelCeils: { [id: number]: { [id: string]: Ceil; }; }) {
        this._area.GetTroops().forEach(troop => 
        {
            const troopSituation = new TroopSituation();
            troopSituation.Troop = troop;
            troopSituations.push(troopSituation);
            
            for (let danger in dangerLevelCeils) 
            {
                for (let ceilKey in dangerLevelCeils[danger]) 
                {
                    var destination = new TroopDestination(
                        dangerLevelCeils[danger][ceilKey], 
                        PlaygroundHelper.Engine.GetPath(troop.Tank.GetCurrentCeil(), dangerLevelCeils[danger][ceilKey]));
                    
                    if (!troopSituation.Destinations.hasOwnProperty(danger)) 
                    {
                        troopSituation.Destinations[danger] = new Array<TroopDestination>();
                    }
                    troopSituation.Destinations[danger].push(destination);
                }
            }
        });
    }

    private GetEnemyCeils(areas: Area[], ally: Tank):Array<Ceil> {
        const enemyCeils = new Array<Ceil>();
        areas.forEach(area => {
            area.GetEnemyCeil(ally).forEach(enemyCeil => {
                enemyCeils.push(enemyCeil);
            });
        });
        return enemyCeils;
    }

    private ResolveConflicts(troops:Array<TroopSituation>, conflicts:Array<Ceil>):void{
        troops.forEach(troop=>
        {
            troop.PotentialNextDestination = troop.GetBestDestination(conflicts);
        });

        var cost = Math.max.apply(Math, troops.map(function(o) { return o.GetPotentialCost(); }));
        for(const troop of troops){
            if(troop.GetPotentialCost()=== cost){
                troop.PotentialNextDestination = null;
                break;
            }
        }

        for(const troop of troops){
            if(troop.PotentialNextDestination != null)
            {
                troop.CurrentDestination = troop.PotentialNextDestination; 
            }
        }
    }
}
