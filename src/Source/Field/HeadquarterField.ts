import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { Sprite } from "pixi.js";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Ceil } from "../Ceil";
import { IField } from "./IField";
import { Vehicle } from "../Vehicle";
import { Truck } from "../Truck";
import { Timer } from "../Tools/Timer";

export class HeadQuarterField extends Item implements IField
{

    private _ceil:Ceil;
    private _timer:Timer;
    IsFading:boolean;
    Diamonds:number=0; 

    constructor(ceil:Ceil,sprite:Sprite){
        super();
        this._ceil = ceil;
        this._ceil.SetField(this);
        this.Z= 0;
        this._timer = new Timer(3);
        this.DisplayObjects.push(sprite);
        PlaygroundHelper.Render.Add(this);
    }

    public Destroy(): void {
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
        this._ceil.DestroyField();
    }

    public GetCeil(): Ceil {
        return this._ceil;
    }

    public Support(vehicule: Vehicle): void 
    {
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;
        vehicule.Attack = PlaygroundHelper.Settings.Attack;

        if(vehicule instanceof Truck)
        {
            var truck = vehicule as Truck;
            this.Diamonds = truck.Unload();
        }
    }
    
    IsDesctrutible(): boolean {
        return false;
    }

    public GetBoundingBox(): BoundingBox{
        return this._ceil.GetBoundingBox();
    }

    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number, zoom: number): void {
        super.Update(viewX,viewY,zoom);

        if(this._timer.IsElapsed())
        { 
            if(this.GetSprites()[0].alpha < 0)
            {
                this.IsFading = false;
            }

            if(1 < this.GetSprites()[0].alpha)
            {
                this.IsFading = true;
            }

            if(this.IsFading)
            {
                this.GetSprites()[0].alpha -= 0.05;
            }

            if(!this.IsFading)
            {
                this.GetSprites()[0].alpha += 0.05;
            }
        }
    }
}
