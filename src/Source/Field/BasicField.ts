import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { Vehicle } from "../Unit/Vehicle";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Ceil } from "../Ceil"; 
import { Field } from "./Field";

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