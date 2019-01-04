import { Sprite } from "pixi.js";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./InteractionContext";
import { Ceil } from "./Ceil";
import { Item } from "./Item";
import { IField } from "./IField";
import { Vehicle } from "./Vehicle";
import { Truck } from "./Truck";

export class DiamondField extends Item implements IField
{
    private _ceil:Ceil;
    private _timeBuffer:number=3;
    private _timing:number=0;
    IsFading:boolean;
    
    constructor(ceil:Ceil){
        super();
        this._ceil = ceil;
        this._ceil.Field = this;
        this.Z= 0;
        this.DisplayObjects.push(new Sprite(PlaygroundHelper.Render.Textures["diamondField.png"]));
        PlaygroundHelper.Render.Add(this);
    }

    public Support(vehicule:Vehicle): void {
        if(vehicule instanceof Truck)
        {
            var truck = vehicule as Truck;
            truck.Load();
        }
    }
    public IsDesctrutible(): boolean {
        return false;
    }

    public GetBoundingBox(): BoundingBox{
        return this._ceil.GetBoundingBox();
    }

    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number, zoom: number): void 
    {
        super.Update(viewX,viewY,zoom);
        this._timing +=1;

        if(this._timing % this._timeBuffer == 0)
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