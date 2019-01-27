import { Item } from "../Item";
import { IField } from "./IField";
import { Ceil } from "../Ceil";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Sprite } from "pixi.js";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { Vehicle } from "../Vehicle";

export class HealField extends Item implements IField
{
    private _ceil:Ceil;

    constructor(ceil:Ceil){
        super();
        this._ceil=ceil;
        this._ceil.SetField(this);
        this.Z= 0; 

        this.DisplayObjects.push(new Sprite(PlaygroundHelper.Render.Textures['healCeil']));        
        PlaygroundHelper.Render.Add(this);
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
        vehicule.SetDamage(-1);
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;
        vehicule.Attack = PlaygroundHelper.Settings.Attack;
    }    

    IsDesctrutible(): boolean {
        return false;
    }

}
