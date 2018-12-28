import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./InteractionContext";
import { Sprite } from "pixi.js";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { Ceil } from "./Ceil";
import { IField } from "./IField";
import { Vehicle } from "./Vehicle";
import { Truck } from "./Truck";

export class HeadQuarterField extends Item implements IField
{
    Ceil:Ceil;
    private _timeBuffer:number=3;
    private _timing:number=0;
    IsFading:boolean;
    Diamonds:number=0;

    constructor(ceil:Ceil){
        super();
        this.Ceil = ceil;
        this.Ceil.Field = this;
        this.Z= 0;
        this.DisplayObjects.push(new Sprite(PlaygroundHelper.Render.Textures["selectedCeil.png"]));
        PlaygroundHelper.Render.Add(this);
    }

    Support(vehicule: Vehicle): void 
    {
        var truck = vehicule as Truck;
        if(truck !== null)
        {
            this.Diamonds = truck.Unload();
            console.log(`UNLOAD ${this.Diamonds}`,'font-weiht:bold;color:blue;')

        }
    }
    IsDesctrutible(): boolean {
        return false;
    }

    public GetBoundingBox(): BoundingBox{
        return this.Ceil.GetBoundingBox();
    }

    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number, zoom: number): void {
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
