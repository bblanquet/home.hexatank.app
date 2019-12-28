import { BasicInfluenceField } from './BasicInfluenceField';
import { Archive } from './../../Utils/ResourceArchiver';
import { CellStateSetter } from './../CellStateSetter';
import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { Battery } from './Battery';
import { BasicItem } from '../../Items/BasicItem';
import { ISelectable } from '../../ISelectable';
import { Headquarter } from './Headquarter';
import { Field } from "./Field";
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { IInteractionContext } from "../../Context/IInteractionContext";
import { Cell } from "../Cell";
import { LiteEvent } from '../../Utils/LiteEvent';
import { CellContainer } from '../CellContainer';
import { PeerHandler } from '../../../Menu/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Menu/Network/PacketKind';

export class InfluenceField extends Field implements ISelectable{

    private _area:Array<BasicItem>=new Array<BasicItem>();
    public Battery:Battery;
    private _range:number=1;
    private _power:number=0;
    private _cellContainer:CellContainer<Cell>=new CellContainer<Cell>();
    public Lost:LiteEvent<InfluenceField> = new LiteEvent<InfluenceField>();
    public basicField:BasicInfluenceField;
    constructor(cell:Cell, public Hq:Headquarter){
        super(cell);
        this.Z= 1;
        this.Hq.AddInfluence(this);
        this.Battery = new Battery(this.Hq,this);
        this.GetCell().SetField(this);
        this.GenerateSprite(Archive.selectionCell);
        this.SetBothProperty(Archive.selectionCell,(e)=>{
            e.alpha=0;
            e.anchor.set(0.5);
        });

        this.IsCentralRef = true;

        this.InitPosition(cell.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
        this.UpdateCellStates(this._range);
        this.basicField = new BasicInfluenceField(this);
    }

    Support(vehicule: Vehicle): void {
        if(vehicule.Hq != this.Hq){
            this.SetSelected(false);
            
            this.Lost.trigger(this,this);
            this.Lost.clear();
            
            this.Hq = vehicule.Hq;
            this.Hq.AddInfluence(this);
            
            this.basicField.Destroy();
            this.basicField = new BasicInfluenceField(this);
        }
    }

    IsDesctrutible(): boolean {
        return false;
    }

    IsBlocking(): boolean {
        return false;
    }

    public GetBoundingBox(): BoundingBox {
        return this.GetCell().GetBoundingBox();
    }

    public Select(context: IInteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number): void 
    {
        super.Update(viewX,viewY);

        this.basicField.Update(viewX,viewY);

        if(this._area){
            this._area.forEach(area => {
                area.Update(viewX,viewY);
            });
        }
    }

    public PowerUp():void{
        PeerHandler.SendMessage(PacketKind.Influence,{
            Hq:this.Hq.GetCurrentCell().GetCoordinate(),
            cell:this.GetCell().GetCoordinate(),
            Type:"PowerUp"
        });
        this.Battery.High();
        this._power +=1;
    }

    public GetPower():number{
        return this._power;
    }

    public GetInternalEnergy():number{
        return this.Battery.GetInternalEnergy();
    }

    public PowerDown():void{
        if(this._power > 0){
            PeerHandler.SendMessage(PacketKind.Influence,{
                Hq:this.Hq.GetCurrentCell().GetCoordinate(),
                cell:this.GetCell().GetCoordinate(),
                Type:"PowerDown"
            });
            this._power -=1;
            this.Battery.Low();
        }
    }

    public RangeDown():void{
        if(this._range > 0){
            PeerHandler.SendMessage(PacketKind.Influence,{
                Hq:this.Hq.GetCurrentCell().GetCoordinate(),
                cell:this.GetCell().GetCoordinate(),
                Type:"RangeDown"
            });
            this.Battery.Low();
            this._range -=1;
            this.RefreshArea();
            this.UpdateCellStates(this._range+1);
            if(this.Hq === PlaygroundHelper.PlayerHeadquarter){
                this.ClearArea();
                this.CreateArea();
            }
        }
    }

    private UpdateCellStates(range:number) {
        CellStateSetter.SetStates(this.GetCell().GetAll(range));
    }

    public RangeUp():void{
        PeerHandler.SendMessage(PacketKind.Influence,{
            Hq:this.Hq.GetCurrentCell().GetCoordinate(),
            cell:this.GetCell().GetCoordinate(),
            Type:"RangeUp"
        });
        this.Battery.High()
        this._range +=1;
        this.RefreshArea();
        this.UpdateCellStates(this._range);
        if(this.Hq === PlaygroundHelper.PlayerHeadquarter){
            this.ClearArea();
            this.CreateArea();
        }
    }

    SetSelected(isSelected: boolean): void {
        this.SetProperty(Archive.selectionCell,(e)=>e.alpha= isSelected ? 1 : 0);
        if(this.IsSelected()){
            this.CreateArea();
        }
        else
        {
            this.ClearArea();
        }
        this.SelectionChanged.trigger(this,this);
    }
    private CreateArea() {
        this.GetCell().GetSpecificRange(this._range).forEach(cell => {
            const b = BoundingBox.CreateFromBox((<Cell>cell).GetBoundingBox());
            const area = new BasicItem(b, this.Hq.GetSkin().GetAreaEnergy(), 3);
            area.SetVisible(() => true);
            area.SetAlive(() => true);
            PlaygroundHelper.Playground.Items.push(area);
            this._area.push(area);
        });
    }

    public GetArea():CellContainer<Cell>{
        if(this._cellContainer.IsEmpty()){
            this.RefreshArea();
        }
        return this._cellContainer;
    }

    private RefreshArea() {
        this._cellContainer.Clear();
        this.GetCell().GetAllNeighbourhood(this._range).forEach(cell => {
            this._cellContainer.Add(cell as Cell);
        });
        this._cellContainer.Add(this.GetCell());
    }

    public Destroy():void{
        super.Destroy();
        if(this.basicField){
            this.basicField.Destroy();
        }
        this._area.forEach(a => 
            a.Destroy());
        this._area = [];
    }

    private ClearArea() {
        if(this.basicField){
            this.basicField.Destroy();
        }
        this._area.forEach(a => 
            a.Destroy());
        this._area = [];
    }

    HasStock() :boolean{
        return this.Battery.HasStock();
    }

    IsSelected(): boolean {
        return this.GetCurrentSprites()[Archive.selectionCell].alpha === 1;
    }
    SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
} 