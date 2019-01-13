import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./Context/InteractionContext";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { Sprite } from "pixi.js";
import { Light } from "./Light";
import { Ceil } from "./Ceil";
import { DiamondField } from "./DiamondField";
import { IField } from "./IField";
import { Vehicle } from "./Vehicle";

export class Diamond extends Item implements IField{
    BoundingBox:BoundingBox;
    Lights:Array<Light>;
    Fields:Array<DiamondField>;
    private _ceil:Ceil;
    private _timeBuffer:number=4;
    private _timing:number=0;

    constructor(ceil:Ceil)
    {
        super();
        this.Z= 1;
        this._ceil = ceil;
        this._ceil.SetField(this);
        this.BoundingBox = this._ceil.GetBoundingBox();
        var sprite = new Sprite(PlaygroundHelper.Render.Textures["diamond.png"]);
        this.DisplayObjects.push(sprite);

        this.Lights = new Array<Light>();
        this.Lights.push(new Light());
        this.Lights.push(new Light());
        this.Lights.push(new Light());

        this.Fields = new Array<DiamondField>();
        var neighbours = this._ceil.GetNeighbourhood();
        neighbours.forEach(ceil=>
        {
            this.Fields.push(new DiamondField(<Ceil>ceil));
        });
        PlaygroundHelper.Render.Add(this);
    }

    GetCeil(): Ceil {
        return this._ceil;
    }

    Support(vehicule:Vehicle): void {
    }
    
    IsDesctrutible(): boolean {
        return true;
    }

    public GetBoundingBox(): BoundingBox{
        return this.BoundingBox;
    }
    
    public Update(viewX: number, viewY: number, zoom: number): void {
        super.Update(viewX,viewY,zoom);
        this.Fields.forEach(field=>{
            field.Update(viewX,viewY,zoom);
        });

        this._timing += 1;
        
        if(this._timing % this._timeBuffer == 0)
        {
            this.Lights.forEach(light=>{
                if(!light.IsShowing)
                {
                    var randomX = Math.random();
                    var randomY = Math.random();
                    var randomXsign = Math.random();
                    var randomYsign = Math.random();
                    var quarter = PlaygroundHelper.Settings.Size/4;
    
                    if(randomXsign < 0.5)
                    {
                        randomX = -quarter * randomX;
                    }
                    else
                    {
                        randomX = quarter * randomX;
                    }
    
                    if(randomYsign < 0.5)
                    {
                        randomY = -quarter * randomY;
                    }
                    else
                    {
                        randomY = quarter * randomY;
                    }
    
                    light.Display(
                        this._ceil.GetBoundingBox().GetCenter() + randomX, 
                        this._ceil.GetBoundingBox().GetMiddle() + randomY);
                }
            });
        }

        this.Lights.forEach(light=>
        {
            if(light.IsShowing)
            {
                light.Update(viewX,viewY,zoom);
            }
        });
    }

     public Select(context: InteractionContext): boolean {
        return false;
    }
}