import { Item } from "./Item";
import { IField } from "./IField";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./Context/InteractionContext";
import { Vehicle } from "./Vehicle";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { Sprite } from "pixi.js";
import { Ceil } from "./Ceil";

export class FastField extends Item implements IField{


    private _ceil:Ceil;

    constructor(ceil:Ceil){
        super();
        this._ceil=ceil;
        this._ceil.SetField(this);
        this.Z= 0;

        this.DisplayObjects.push(new Sprite(PlaygroundHelper.Render.Textures['fastCeil']));        
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
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed*2;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed*2;
    }    

    IsDesctrutible(): boolean {
        return false;
    }
}