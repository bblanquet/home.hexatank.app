import { Vehicle } from "../../Unit/Vehicle";
import { Ceil } from "../Ceil";
import { InteractionContext } from "../../Context/InteractionContext";
import { BoundingBox } from "../../BoundingBox";
import { Archive } from "../../Tools/ResourceArchiver";
import { Field } from "./Field";
import { CeilState } from "../CeilState";

export class WaterField extends Field
{
    private _isIncreasingOpacity:boolean=false;

    constructor(ceil:Ceil){
        super(ceil);
        this.GetCeil().SetField(this);
        this.Z= 0;
        this.GenerateSprite(Archive.nature.water.middle.background);
        this.GenerateSprite(Archive.nature.water.middle.wave);
        this.GenerateSprite(Archive.nature.water.leaf);

        this.GetSprites().forEach(sprite => {
            sprite.width = this.GetCeil().GetBoundingBox().Width,
            sprite.height = this.GetCeil().GetBoundingBox().Height
            sprite.anchor.set(0.5);
        });

        this.IsCentralRef = true;

        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCeil().IsVisible();});
    }

    protected OnCeilStateChanged(ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible || ceilState === CeilState.HalfVisible;
        });
    }

    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);
        this.SetBothProperty(Archive.nature.water.leaf,s=>s.rotation += 0.005);

        this.SetProperty(Archive.nature.water.middle.wave,s=>{
            if(s.alpha < 0.4){
                this._isIncreasingOpacity = true;
            }

            if(1 <= s.alpha){
                this._isIncreasingOpacity = false;
            }

            s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01; 
        });
        
    };

    public GetBoundingBox(): BoundingBox {
        return this.GetCeil().GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    Support(vehicule: Vehicle): void {
        throw new Error("not supposed to happen");
    }    
    
    IsDesctrutible(): boolean {
        return false;
    }
    IsBlocking(): boolean {
        return true;
    }

}