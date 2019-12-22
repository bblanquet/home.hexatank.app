import { ISelectable } from '../../ISelectable';
import { Headquarter } from './Headquarter';
import { Field } from "./Field";
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { IInteractionContext } from "../../Context/IInteractionContext";
import { Ceil } from "../Ceil";
import { LiteEvent } from '../../Utils/LiteEvent';
import { Archive } from '../../Utils/ResourceArchiver';

export class InfluenceField extends Field implements ISelectable{

    private _isIncreasingOpacity:boolean=false;
    constructor(ceil:Ceil, private _hq:Headquarter){
        super(ceil);
        this.Z= 1;
        this.GetCeil().SetField(this);
        this.GenerateSprite(this._hq.GetSkin().GetBaseEnergy(),s=>s.alpha=1);      
        this.GenerateSprite(this._hq.GetSkin().GetEnergy(),s=>s.alpha=1);   
        this.GetSprites().forEach(sprite => {
            sprite.width = this.GetCeil().GetBoundingBox().Width,
            sprite.height = this.GetCeil().GetBoundingBox().Height
            sprite.anchor.set(0.5);
        });
        this.GenerateSprite(Archive.selectionCell);
        this.SetBothProperty(Archive.selectionCell,(e)=>{
            e.alpha=0;
            e.anchor.set(0.5);
        });

        this.IsCentralRef = true;

        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCeil().IsVisible();});
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
        return this.GetCeil().GetBoundingBox();
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
    }
    IsSelected(): boolean {
        return this.GetCurrentSprites()[Archive.selectionCell].alpha === 1;
    }
    SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
}