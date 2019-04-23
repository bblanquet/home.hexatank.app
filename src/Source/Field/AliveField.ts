import { AliveItem } from "../AliveItem";
import { IField } from "./IField";
import { Vehicle } from "../Unit/Vehicle";
import { Ceil } from "../Ceil";
import { CeilState } from "../CeilState";

export abstract class AliveField extends AliveItem implements IField{
    
    abstract Support(vehicule: Vehicle): void ;
    abstract IsDesctrutible(): boolean ;
    abstract IsBlocking(): boolean ;

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

    public GetCeil(): Ceil {
        return this._ceil
    }

    public GetCurrentCeil(): Ceil {
        return this._ceil;
    }

    public Destroy():void{
        super.Destroy();
        this._ceil.UnregisterCeilState(this._onCeilStateChanged);
    }


}