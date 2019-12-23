import { InteractionContext } from "../../Context/InteractionContext";
import { Cell } from "../Cell";
import { Archive } from "../../Utils/ResourceArchiver";
import { Field } from "./Field";
import { BoundingBox } from "../../Utils/BoundingBox";      
import { Vehicle } from "../../Items/Unit/Vehicle";
import { CellState } from "../CellState";
import { GameSettings } from "../../Utils/GameSettings";

export class FastField extends Field
{
    constructor(cell:Cell){
        super(cell);
        this.GetCell().SetField(this);
        this.Z= 1;

        this.GenerateSprite(Archive.bonus.speed);
        this.InitPosition(cell.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
    }

    protected OnCellStateChanged(cellState: CellState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = cellState !== CellState.Hidden;
        });
    }

    public GetBoundingBox(): BoundingBox { 
        return this.GetCell().GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    Support(vehicule: Vehicle): void {
        vehicule.TranslationSpeed = GameSettings.TranslationSpeed*3;
        vehicule.RotationSpeed = GameSettings.RotationSpeed*3;
        vehicule.Attack = GameSettings.Attack;
    }    

    IsDesctrutible(): boolean {
        return false;
    }
    IsBlocking(): boolean {
        return false;
    }
}