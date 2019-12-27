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
    private _isIncreasingOpacity:boolean=false;
    private _area:Array<BasicItem>=new Array<BasicItem>();
    
    public Battery:Battery;
    private _range:number=1;
    private _power:number=0;
    private _cellContainer:CellContainer<Cell>=new CellContainer<Cell>();

    constructor(cell:Cell, public Hq:Headquarter){
        super(cell);
        this.Z= 1;
        this.Hq.InfluenceFields.push(this);
        this.Battery = new Battery(this.Hq,this);
        this.GetCell().SetField(this);
        this.GenerateSprite(this.Hq.GetSkin().GetBaseEnergy(),s=>s.alpha=1);      
        this.GenerateSprite(this.Hq.GetSkin().GetEnergy(),s=>s.alpha=1);   
        this.GetSprites().forEach(sprite => {
            sprite.width = this.GetCell().GetBoundingBox().Width,
            sprite.height = this.GetCell().GetBoundingBox().Height
            sprite.anchor.set(0.5);
        });
        this.GenerateSprite(Archive.selectionCell);
        this.SetBothProperty(Archive.selectionCell,(e)=>{
            e.alpha=0;
            e.anchor.set(0.5);
        });

        this.IsCentralRef = true;

        this.InitPosition(cell.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
        this.UpdateCellStates(this._range);
    }

    Support(vehicule: Vehicle): void {
        if(vehicule.Hq != this.Hq){
            this.SetProperty(this.Hq.GetSkin().GetBaseEnergy(),e=>e.alpha = 0);
            this.SetProperty(this.Hq.GetSkin().GetEnergy(),e=>e.alpha = 0);
            
            this.Hq.InfluenceFields = this.Hq.InfluenceFields.filter(f=>f !== this);
            this.Hq = vehicule.Hq;
            this.Hq.InfluenceFields.push(this);
            if(!this.ExistsSprite(this.Hq.GetSkin().GetBaseEnergy())){
                this.GenerateSprite(this.Hq.GetSkin().GetBaseEnergy(),s=>{
                    s.width = this.GetCell().GetBoundingBox().Width,
                    s.height = this.GetCell().GetBoundingBox().Height
                    s.anchor.set(0.5);
                });      
                this.GenerateSprite(this.Hq.GetSkin().GetEnergy(),s=>{
                    s.width = this.GetCell().GetBoundingBox().Width,
                    s.height = this.GetCell().GetBoundingBox().Height
                    s.anchor.set(0.5);
                });        
            }

            this.SetProperty(this.Hq.GetSkin().GetBaseEnergy(),e=>e.alpha = 1);
            this.SetProperty(this.Hq.GetSkin().GetEnergy(),e=>e.alpha = 1);
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

        this.SetBothProperty(this.Hq.GetSkin().GetEnergy(),s=>s.rotation += 0.01*(this._power));

        this.SetProperty(this.Hq.GetSkin().GetBaseEnergy(),s=>{
            if(s.alpha < 0.4){
                this._isIncreasingOpacity = true;
            }

            if(1 <= s.alpha){
                this._isIncreasingOpacity = false;
            }

            s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01; 
        });
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
            const area = new BasicItem(b, Archive.building.hq.red.area, 3);
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

    private ClearArea() {
        this._area.forEach(a => 
            a.Destroy());
        this._area = [];
    }

    IsSelected(): boolean {
        return this.GetCurrentSprites()[Archive.selectionCell].alpha === 1;
    }
    SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
} 