import { AliveItem } from "../../Items/AliveItem";
import { IField } from "./IField";
import { Ceil } from "../Ceil"; 
import { CeilState } from "../CeilState";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { PeerHandler } from "../../../Menu/Network/Host/On/PeerHandler";
import { PacketKind } from "../../../Menu/Network/PacketKind";

export abstract class AliveField extends AliveItem implements IField{
    
    abstract Support(vehicule: Vehicle): void ;
    abstract IsDesctrutible(): boolean ;
    abstract IsBlocking(): boolean ;

    private _onCellStateChanged:{(obj:any,ceilState:CeilState):void};

    constructor(private _cell:Ceil){
        super();
        this._onCellStateChanged = this.OnCellStateChanged.bind(this);
        this._cell.CellStateChanged.on(this._onCellStateChanged);
    }

    protected OnCellStateChanged(obj:any,ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible;
        });
    }

    public GetCeil(): Ceil {
        return this._cell
    }

    public GetCurrentCeil(): Ceil {
        return this._cell;
    }

    public Destroy():void{
        PeerHandler.SendMessage(PacketKind.Destroyed,{
            Ceil:this._cell.GetCoordinate(),
            Name:"field"
        });
        super.Destroy();
        this._cell.CellStateChanged.off(this._onCellStateChanged);
    }


}