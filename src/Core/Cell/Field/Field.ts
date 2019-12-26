import { IField } from "./IField";
import { Cell } from "../Cell";
import { CellState } from "../CellState";      
import { Item } from "../../Items/Item";
import { Vehicle } from "../../Items/Unit/Vehicle";

export abstract class Field extends Item implements IField{

    private _onCellStateChanged:{(obj:any,cellState:CellState):void};

    constructor(private _cell:Cell){
        super();
        this._onCellStateChanged = this.OnCellStateChanged.bind(this); 
        this._cell.CellStateChanged.on(this._onCellStateChanged);
    }

    protected OnCellStateChanged(obj:any,cellState: CellState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = cellState !== CellState.Hidden;
        });
    }

    public Destroy():void{
        super.Destroy();
        this._cell.CellStateChanged.off(this._onCellStateChanged);
    }

    protected GetInfluenceSum(vehicule: Vehicle) {
        const influences = vehicule.Hq.InfluenceFields.filter(f => f.GetArea().Exist(this.GetCell().GetCoordinate()));
        const sum = 1 + (influences.map(i => i.GetPower()).reduce((a, b) => a + b,0) / 10);
        return sum;
    }

    abstract Support(vehicule: Vehicle):void;
    abstract IsDesctrutible(): boolean;
    abstract IsBlocking(): boolean;
    GetCell(): Cell {
        return this._cell;
    }


} 