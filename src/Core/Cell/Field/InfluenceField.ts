import { BasicItem } from '../../Items/BasicItem';
import { ISelectable } from '../../ISelectable';
import { Headquarter } from './Headquarter';
import { Field } from "./Field";
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { IInteractionContext } from "../../Context/IInteractionContext";
import { Cell } from "../Cell";
import { LiteEvent } from '../../Utils/LiteEvent';
import { Archive } from '../../Utils/ResourceArchiver';

export class InfluenceField extends Field implements ISelectable{

    private _isIncreasingOpacity:boolean=false;
    private _area:Array<BasicItem>=new Array<BasicItem>();
    public Range:number=1;

    constructor(ceil:Cell, private _hq:Headquarter){
        super(ceil);
        this.Z= 1;
        this.GetCell().SetField(this);
        this.GenerateSprite(this._hq.GetSkin().GetBaseEnergy(),s=>s.alpha=1);      
        this.GenerateSprite(this._hq.GetSkin().GetEnergy(),s=>s.alpha=1);   
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

        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
    }

    Support(vehicule: Vehicle): void {
        
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

        this.SetBothProperty(this._hq.GetSkin().GetEnergy(),s=>s.rotation += 0.005);

        this.SetProperty(this._hq.GetSkin().GetBaseEnergy(),s=>{
            if(s.alpha < 0.4){
                this._isIncreasingOpacity = true;
            }

            if(1 <= s.alpha){
                this._isIncreasingOpacity = false;
            }

            s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01; 
        });

    }

    SetSelected(isSelected: boolean): void {
        this.SetProperty(Archive.selectionCell,(e)=>e.alpha= isSelected ? 1 : 0);
        this.SelectionChanged.trigger(this,this);
        if(this.IsSelected()){
            this.GetCell()
        }
        else
        {

        }
    }
    IsSelected(): boolean {
        return this.GetCurrentSprites()[Archive.selectionCell].alpha === 1;
    }
    SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
}