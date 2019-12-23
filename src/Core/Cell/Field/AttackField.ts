import { InteractionContext } from "../../Context/InteractionContext";
import { Cell } from "../Cell";
import { Archive } from "../../Utils/ResourceArchiver"; 
import { Field } from "./Field"; 
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle"; 
import { CellState } from "../CellState";
import { GameSettings } from "../../Utils/GameSettings";

export class AttackField extends Field
{
    constructor(cell:Cell){
        super(cell);
        this.GetCell().SetField(this);
        this.Z= 1; 

        this.GenerateSprite(Archive.bonus.strength);      
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
        vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
        vehicule.RotationSpeed = GameSettings.RotationSpeed;    
        vehicule.Attack = GameSettings.Attack * 3;
    }    

    IsDesctrutible(): boolean {
        return false;
    }

    IsBlocking(): boolean {
        return false;
    }

}