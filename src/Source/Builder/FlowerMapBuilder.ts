import { IPlaygroundBuilder } from "./IPlaygroundBuilder";
import { Ceil } from "../Ceil"; 
import { HexAxial } from "../Coordinates/HexAxial";
import { AreaEngine } from "../Ia/Area/AreaEngine";
import { CeilsContainer } from "../CeilsContainer";
import { HexagonalMapBuilder } from "./HexagonalMapBuilder";

export class FlowerMapBuilder implements IPlaygroundBuilder<Ceil>{

    private _hexagonalBuilder:HexagonalMapBuilder;
    
    constructor(){
        this._hexagonalBuilder = new HexagonalMapBuilder();
    }

    public Build(seize: number): Ceil[] {
        const initialCeils =  this._hexagonalBuilder.Build(seize);
        const container = new CeilsContainer<Ceil>();
        initialCeils.forEach(ceil => {
            container.Add(ceil);
        });
        const areaEngine = new AreaEngine();
        var areas = areaEngine.GetAreas(container,<Ceil> container.Get(this.GetMidle(seize)));
        var result = new Array<Ceil>();
        areas.forEach(area =>{
            const ceils = container.GetNeighbourhood(area.GetCoordinate()); 
            if(ceils.length === 6){
                result.push(area);
                ceils.forEach(ceil=>{
                    result.push(<Ceil>ceil);
                })
            }
        });

        return result;
    }
    public GetMidle(n: number): HexAxial {
        return this._hexagonalBuilder.GetMidle(n);
    }

    public GetAreaMiddleCeil(size: number): Array<HexAxial> {
        const initialCeils =  this._hexagonalBuilder.Build(size);
        const container = new CeilsContainer<Ceil>();
        initialCeils.forEach(ceil => {
            container.Add(ceil);
        });
        const areaEngine = new AreaEngine();
        var areas = areaEngine.GetAreas(container,<Ceil> container.Get(this.GetMidle(size)));
        const result = areas.map(a=>a.GetCoordinate());
        result.shift();
        return result.filter(a=> container.GetNeighbourhood(a).length === 6);
    }

}