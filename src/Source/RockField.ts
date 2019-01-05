import { Ceil } from "./Ceil";
import { AliveItem } from "./AliveItem";
import { IField } from "./IField";
import { Vehicle } from "./Vehicle";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./Context/InteractionContext";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { Sprite } from "pixi.js";

export class RockField extends AliveItem implements IField
{

    private _ceil:Ceil;
    
    constructor(ceil:Ceil, sprite:string){
        super();
        this._ceil = ceil;
        this._ceil.Field = this;
        this.Z= 0;
        this.DisplayObjects.push(new Sprite(PlaygroundHelper.Render.Textures[sprite]));
        PlaygroundHelper.Render.Add(this);
    }

    GetCeil(): Ceil {
        return this._ceil;
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
        return this._ceil.GetBoundingBox();
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
        this._ceil.Field = null;
        this.IsUpdatable = false;
    }
}