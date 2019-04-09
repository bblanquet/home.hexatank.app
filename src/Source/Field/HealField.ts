import { Item } from "../Item";
import { IField } from "./IField";
import { Ceil } from "../Ceil";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { Vehicle } from "../Unit/Vehicle";
import { Archive } from "../Tools/ResourceArchiver";

export class HealField extends Item implements IField
{ 
    private _ceil:Ceil;

    constructor(ceil:Ceil){
        super();
        this._ceil=ceil;
        this._ceil.SetField(this);
        this.Z= 1; 

        this.GenerateSprite(Archive.bonus.health);      
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
        vehicule.SetDamage(-0.1);
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

}
