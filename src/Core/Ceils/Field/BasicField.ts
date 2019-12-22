import { InteractionContext } from "../../Context/InteractionContext";
import { Ceil } from "../Ceil"; 
import { Field } from "./Field";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { BoundingBox } from "../../Utils/BoundingBox";

export class BasicField extends Field{

    constructor(ceil:Ceil){
        super(ceil); 
        this.GetCeil().SetField(this);
    }

    Support(vehicule: Vehicle): void {
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;
        vehicule.Attack = PlaygroundHelper.Settings.Attack;
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
    public Select(context: InteractionContext): boolean {
        return false;
    }
    public Update(viewX: number, viewY: number): void {}


}