import { IField } from "./IField";
import { Ceil } from "../Ceil";
import { CeilState } from "../CeilState";
import { Item } from "../../Items/Item";
import { Vehicle } from "../../Items/Unit/Vehicle";

export abstract class Field extends Item implements IField{

    private _onCeilStateChanged:{(ceilState:CeilState):void};

    constructor(private _ceil:Ceil){
        super();
        this._onCeilStateChanged = this.OnCeilStateChanged.bind(this); 
        this._ceil.RegisterCeilState(this._onCeilStateChanged);
    }

    protected OnCeilStateChanged(ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible;
        });
    }

    public Destroy():void{
        super.Destroy();
        this._ceil.UnregisterCeilState(this._onCeilStateChanged);
    }

    abstract Support(vehicule: Vehicle):void;
    abstract IsDesctrutible(): boolean ;
    abstract IsBlocking(): boolean ;
    GetCeil(): Ceil {
        return this._ceil;
    }


} 