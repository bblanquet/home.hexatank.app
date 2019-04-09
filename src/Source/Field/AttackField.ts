import { Item } from "../Item";
import { IField } from "./IField";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { Vehicle } from "../Unit/Vehicle";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Ceil } from "../Ceil";
import { Archive } from "../Tools/ResourceArchiver"; 

export class AttackField extends Item implements IField
{
    private _ceil:Ceil;
 
    constructor(ceil:Ceil){
        super(); 
        this._ceil=ceil;
        this._ceil.SetField(this);
        this.Z= 1;

        this.GenerateSprite(Archive.bonus.strength);        
        this.InitPosition(ceil.GetBoundingBox());
    }

    GetCeil(): Ceil {
        return this._ceil;
    }

    public GetBoundingBox(): BoundingBox {
        return this._ceil.GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    Support(vehicule: Vehicle): void {
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;    
        vehicule.Attack = 50;
    }    

    IsDesctrutible(): boolean {
        return false;
    }
    IsBlocking(): boolean {
        return false;
    }
}