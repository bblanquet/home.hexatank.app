import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./InteractionContext";
import { Sprite } from "pixi.js";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { Ceil } from "./Ceil";
import { HeadQuarterField } from "./HeadquarterField";
import { Tank } from "./Tank";
import { HqSkin } from "./HqSkin";
import { Truck } from "./Truck";

export class Headquarter extends Item{

    BoundingBox:BoundingBox;
    Ceil:Ceil;
    Fields:Array<HeadQuarterField>;
    Diamonds:number=20;
    private _skin:HqSkin;
    private _graphics:PIXI.Graphics;

    constructor(skin:HqSkin, ceil:Ceil){
        super();
        this._skin = skin;
        this.Z= 2;
        this.Ceil = ceil;
        var sprite = new Sprite(PlaygroundHelper.Render.Textures["hq"]);

        this.DisplayObjects.push(sprite);
        this.BoundingBox = new BoundingBox();
        this.BoundingBox.Width = this.Ceil.GetBoundingBox().Width;
        this.BoundingBox.Height = this.Ceil.GetBoundingBox().Height;
        this.BoundingBox.X = this.Ceil.GetBoundingBox().X;
        this.BoundingBox.Y = this.Ceil.GetBoundingBox().Y;

        /*
        this._graphics = new PIXI.Graphics();
        this._graphics.beginFill(0xb31616,1);//skin.GetColor()
        this._graphics.drawCircle(this.Ceil.GetBoundingBox().X,this.Ceil.GetBoundingBox().Y,this.Ceil.GetBoundingBox().Width);
        this.DisplayObjects.push(this._graphics);
        */

        this.GetSprites().forEach(obj => {
            obj.width = this.BoundingBox.Width,
            obj.height = this.BoundingBox.Height
            obj.pivot.set(PlaygroundHelper.Settings.Pivot
                ,PlaygroundHelper.Settings.Pivot);
        });
        this.IsCentralRef = true;

        var neighbours = this.Ceil.GetNeighbourhood();
        this.Fields = new Array<HeadQuarterField>();
        neighbours.forEach(ceil=>
        {
            this.Fields.push(new HeadQuarterField(<Ceil>ceil));
        });
        PlaygroundHelper.Render.Add(this);
    }
    
    public GetSkin():HqSkin{
        return this._skin;
    }

    public CreateTank():boolean
    {
        let isCreated = false;
        this.Fields.every(field=>
        {
            if(!field.Ceil.IsBlocked())
            {
                var tank = new Tank(this);
                PlaygroundHelper.Add(tank);
                tank.SetPosition(field.Ceil);
                PlaygroundHelper.Render.Add(tank);
                PlaygroundHelper.Playground.Items.push(tank);
                isCreated = true;
                return false;
            }
            return true;
        });

        return isCreated;
    }

    CreateTruck():boolean
    {
        let isCreated = false;
        this.Fields.every(field=>
        {
            if(!field.Ceil.IsBlocked())
            {
                var truck = new Truck(this);
                PlaygroundHelper.Add(truck);
                truck.SetPosition(field.Ceil);
                PlaygroundHelper.Render.Add(truck);
                PlaygroundHelper.Playground.Items.push(truck);
                isCreated = true;
                return false;
            }
            return true;
        });

        return isCreated;
    }

    public GetBoundingBox(): BoundingBox {
        return this.BoundingBox;
    }   

    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number, zoom: number):void{
        super.Update(viewX,viewY,zoom);

        this.Fields.forEach(field=>{
            field.Update(viewX,viewY,zoom);
            this.Diamonds += field.Diamonds;
            field.Diamonds = 0;            
        });
    }

}