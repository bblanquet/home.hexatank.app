import { Ceil } from "../Ceil";
import { InteractionContext } from "../../Context/InteractionContext";
import { Archive } from "../../Utils/ResourceArchiver";
import { Field } from "./Field";
import { CeilState } from "../CeilState";
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";

export class VolcanoField extends Field
{
    private _isIncreasingOpacity:boolean=false;

    constructor(ceil:Ceil){
        super(ceil);
        this.GetCeil().SetField(this);
        this.Z= 1;
        this.GenerateSprite(Archive.nature.volcano);
        this.GenerateSprite(Archive.nature.volcanaoAnimation);

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

        this.SetProperty(Archive.nature.volcanaoAnimation,s=>{
            if(s.alpha < 0){
                this._isIncreasingOpacity = true;
            }

            if(0.6 <= s.alpha){
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