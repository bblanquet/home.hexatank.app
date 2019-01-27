import { Item } from "../Item";
import { IField } from "./IField";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { Vehicle } from "../Vehicle";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Ceil } from "../Ceil";

export class BasicField extends Item implements IField{
    private _ceil:Ceil;

    constructor(ceil:Ceil){
        super();
        this._ceil=ceil;
        this._ceil.SetField(this);
    }

    GetCeil(): Ceil {
        return this._ceil;
    }

    Support(vehicule: Vehicle): void {
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;
        vehicule.Attack = PlaygroundHelper.Settings.Attack;
    }    
    
    IsDesctrutible(): boolean {
        return false;
    }
    public GetBoundingBox(): BoundingBox {
        return this._ceil.GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    public Update(viewX: number, viewY: number, zoom: number): void {}


}