import { Cell } from "../Cell";
import { InteractionContext } from "../../Context/InteractionContext";
import { Archive } from "../../Utils/ResourceArchiver";
import { Field } from "./Field"; 
import { BoundingBox } from "../../Utils/BoundingBox";      
import { Vehicle } from "../../Items/Unit/Vehicle";
import { CellState } from "../CellState";
import { GameSettings } from "../../Utils/GameSettings";

export class PoisonField extends Field
{ 
    constructor(ceil:Cell){
        super(ceil);
        this.GetCell().SetField(this);
        this.Z= 1; 
 
        this.GenerateSprite(Archive.bonus.poison);      
        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
    }

    protected OnCellStateChanged(ceilState: CellState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState !== CellState.Hidden; 
        });
    }

    public GetBoundingBox(): BoundingBox {
        return this.GetCell().GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    Support(vehicule: Vehicle): void {
        const sum = this.GetInfluenceSum(vehicule);
        vehicule.SetDamage(0.15+sum);
        vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
        vehicule.RotationSpeed = GameSettings.RotationSpeed;
        vehicule.Attack = GameSettings.Attack;
    }    

    IsDesctrutible(): boolean {
        return false;
    }

    IsBlocking(): boolean {
        return false;
    }

}
