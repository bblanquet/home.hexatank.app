import { InteractionContext } from "../../Context/InteractionContext";
import { Ceil } from "../Ceil";
import { Archive } from "../../Utils/ResourceArchiver"; 
import { Field } from "./Field"; 
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";

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

    public GetBoundingBox(): BoundingBox {
        return this.GetCeil().GetBoundingBox();
    }
    
    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Support(vehicule: Vehicle): void {
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;    
        vehicule.Attack = 50;
    }    

    public IsDesctrutible(): boolean {
        return false;
    }
    public IsBlocking(): boolean {
        return false;
    }
}