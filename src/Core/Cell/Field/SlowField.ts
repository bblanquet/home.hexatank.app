import { InteractionContext } from "../../Context/InteractionContext";
import { Cell } from "../Cell";
import { Archive } from "../../Utils/ResourceArchiver";      
import { Field } from "./Field";
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { CellState } from "../CellState";
import { GameSettings } from "../../Utils/GameSettings";

export class SlowField extends Field
{
    constructor(ceil:Cell){
        super(ceil);
        this.GetCell().SetField(this);
        this.Z= 1;

        this.GenerateSprite(Archive.bonus.slow);
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
        vehicule.TranslationSpeed = GameSettings.TranslationSpeed*(0.8*(1/sum));
        vehicule.RotationSpeed = GameSettings.RotationSpeed*(0.8*(1/sum));
        vehicule.Attack = GameSettings.Attack;
    }    

    IsDesctrutible(): boolean {
        return false;
    }
    IsBlocking(): boolean {
        return false;
    }
}