import { InteractionContext } from "../../Context/InteractionContext";
import { Ceil } from "../Ceil";
import { Archive } from "../../Utils/ResourceArchiver";
import { Field } from "./Field";
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";

export class FastField extends Field
{
    constructor(ceil:Ceil){
        super(ceil);
        this.GetCeil().SetField(this);
        this.Z= 1;

        this.GenerateSprite(Archive.bonus.speed);
        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCeil().IsVisible();});
    }

    public GetBoundingBox(): BoundingBox {
        return this.GetCeil().GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    Support(vehicule: Vehicle): void {
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed*2;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed*2;
        vehicule.Attack = PlaygroundHelper.Settings.Attack;
    }    

    IsDesctrutible(): boolean {
        return false;
    }
    IsBlocking(): boolean {
        return false;
    }
}