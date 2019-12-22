import { InteractionContext } from "../../Context/InteractionContext";
import { Ceil } from "../Ceil";
import { Archive } from "../../Utils/ResourceArchiver"; 
import { Field } from "./Field"; 
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { CeilState } from "../CeilState";

export class AttackField extends Field
{
    constructor(ceil:Ceil){
        super(ceil);
        this.GetCeil().SetField(this);
        this.Z= 1; 

        this.GenerateSprite(Archive.bonus.strength);      
        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCeil().IsVisible();});
    }

    protected OnCellStateChanged(ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState !== CeilState.Hidden;
        });
    }

    public GetBoundingBox(): BoundingBox {
        return this.GetCeil().GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    Support(vehicule: Vehicle): void {
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;    
        vehicule.Attack = PlaygroundHelper.Settings.Attack * 3;
    }    

    IsDesctrutible(): boolean {
        return false;
    }

    IsBlocking(): boolean {
        return false;
    }

}