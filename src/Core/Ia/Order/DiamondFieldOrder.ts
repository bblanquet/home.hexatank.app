import { SimpleOrder } from "./SimpleOrder";
import { Cell } from "../../Cell/Cell";
import { Diamond } from "../../Cell/Field/Diamond"; 
import { Vehicle } from "../../Items/Unit/Vehicle";

export class DiamondFieldOrder extends SimpleOrder
{
    constructor(private _diamond:Diamond,private _vehicule:Vehicle){ 
        super(_diamond.GetCell(),_vehicule);
    }
    
    protected GetClosestcell():Cell{
        let cells = this.GetCells(this._diamond);
        if(0 < cells.length)
        {
            let cell =  this.cellFinder.GetCell(cells, this._vehicule);
            this.OriginalDest = cell;
            return cell; 
        }
        else
        {
            return null;
        }
    }

    private GetCells(hq:Diamond):Array<Cell>{
        return hq.GetCell().GetNeighbourhood().map(c=><Cell>c);
    }
}