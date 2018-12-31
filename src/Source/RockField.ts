import { Ceil } from "./Ceil";
import { AliveItem } from "./AliveItem";
import { IField } from "./IField";
import { Vehicle } from "./Vehicle";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./InteractionContext";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { Sprite } from "pixi.js";

export class RockField extends AliveItem implements IField
{
    Ceil:Ceil;
    
    constructor(ceil:Ceil, sprite:string){
        super();
        this.Ceil = ceil;
        this.Ceil.Field = this;
        this.Z= 0;
        this.DisplayObjects.push(new Sprite(PlaygroundHelper.Render.Textures[sprite]));//"blockedCeil.png"
        PlaygroundHelper.Render.Add(this);
    }

    Support(vehicule: Vehicle): void {
        //nothing
    }
    IsDesctrutible(): boolean {
        return true;
    }

    public IsEnemy(item: AliveItem): boolean {
        return true;
    }

    public GetBoundingBox(): BoundingBox {
        return this.Ceil.GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        //nothing
        return false;
    }

    public Update(viewX: number, viewY: number, zoom: number):void{
        if(!this.IsAlive())
        {
            this.Destroy();
            return;
        }
        super.Update(viewX,viewY,zoom);
    }

    public Destroy():void{
        PlaygroundHelper.Render.Remove(this);
        this.Ceil.Field = null;
        this.IsUpdatable = false;
    }
}