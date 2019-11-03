import { IField } from "./IField";
import { Ceil } from "../Ceil";
import { CeilState } from "../CeilState";
import { Item } from "../../Items/Item";
import { Vehicle } from "../../Items/Unit/Vehicle";

export abstract class Field extends Item implements IField{

    private _onCellStateChanged:{(obj:any,ceilState:CeilState):void};

    constructor(private _cell:Ceil){
        super();
        this._onCellStateChanged = this.OnCeilStateChanged.bind(this); 
        this._cell.CellStateChanged.on(this._onCellStateChanged);
    }

    protected OnCeilStateChanged(obj:any,ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible;
        });
    }

    public Destroy():void{
        super.Destroy();
        this._cell.CellStateChanged.off(this._onCellStateChanged);
    }

    abstract Support(vehicule: Vehicle):void;
    abstract IsDesctrutible(): boolean ;
    abstract IsBlocking(): boolean ;
    GetCeil(): Ceil {
        return this._cell;
    }


} 