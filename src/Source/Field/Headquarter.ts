import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { Sprite } from "pixi.js";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Ceil } from "../Ceil";
import { HeadQuarterField } from "./HeadquarterField";
import { Tank } from "../Tank";
import { HqSkin } from "../HqSkin";
import { Truck } from "../Truck";
import { AliveItem } from "../AliveItem";
import { IHqContainer } from "../IHqContainer";
import { IField } from "./IField";
import { Vehicle } from "../Vehicle";
import { Crater } from "../Crater";
import { ISelectable } from "../ISelectable";
import { Timer } from "../Tools/Timer";

export class Headquarter extends AliveItem implements IField, ISelectable
{
    BoundingBox:BoundingBox;
    private _ceil:Ceil; 
    Fields:Array<HeadQuarterField>;
    Diamonds:number=40;
    private _skin:HqSkin;
    IsFading:boolean;
    private _timer:Timer;
    private _selectionSprite:Sprite;

    constructor(skin:HqSkin, ceil:Ceil){
        super();
        this._skin = skin;
        this.Z= 2;
        this._ceil = ceil;
        this._ceil.SetField(this);
        this._timer = new Timer(3);

        this._selectionSprite = new PIXI.Sprite(PlaygroundHelper.Render.Textures['selection']);
        this.DisplayObjects.push(this._selectionSprite);
        this._selectionSprite.alpha = 0;

        this.BoundingBox = new BoundingBox();
        this.BoundingBox.Width = this._ceil.GetBoundingBox().Width;
        this.BoundingBox.Height = this._ceil.GetBoundingBox().Height;
        this.BoundingBox.X = this._ceil.GetBoundingBox().X;
        this.BoundingBox.Y = this._ceil.GetBoundingBox().Y;

        this.DisplayObjects.push(new Sprite(PlaygroundHelper.Render.Textures["hqLight"]));
        this.DisplayObjects.push(skin.GetColor());
        this.DisplayObjects.push(new Sprite(PlaygroundHelper.Render.Textures["hq"]));

        this.GetSprites().forEach(obj => {
            obj.width = this.BoundingBox.Width,
            obj.height = this.BoundingBox.Height
            obj.pivot.set(PlaygroundHelper.Settings.Pivot
                ,PlaygroundHelper.Settings.Pivot);
        });
        this.IsCentralRef = true;

        var neighbours = this._ceil.GetNeighbourhood();
        this.Fields = new Array<HeadQuarterField>();
        neighbours.forEach(ceil=>
        {
            this.Fields.push(new HeadQuarterField(this,<Ceil>ceil,skin.GetCeil()));
        });
        PlaygroundHelper.Render.Add(this);
    }

    public IsSelected():boolean{
        return this._selectionSprite.alpha === 1;
    }

    public SetSelected(state:boolean):void{
        this._selectionSprite.alpha = state ? 1 : 0;
    }

    private IsHqContainer(item: any):item is IHqContainer{
        return 'Hq' in item;
    }

    public IsEnemy(item: AliveItem): boolean {
        if(this.IsHqContainer(item as any))
        {
            return (<IHqContainer>(item as any)).Hq !== this;
        }
        return false;
    }
    
    Support(vehicule: Vehicle): void {
    }

    IsDesctrutible(): boolean {
        return true;
    }
    GetCeil(): Ceil {
        return this._ceil;
    }

    IsBlocking(): boolean {
        return true;
    }

    public GetSkin():HqSkin{
        return this._skin;
    }

    public CreateTank():boolean
    {
        let isCreated = false;
        this.Fields.every(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                var tank = new Tank(this);
                tank.SetPosition(field.GetCeil());
                PlaygroundHelper.Render.Add(tank);
                PlaygroundHelper.Playground.Items.push(tank);
                isCreated = true;
                return false;
            }
            return true;
        });

        return isCreated;
    }

    public CreateTruck():boolean
    {
        let isCreated = false;
        this.Fields.every(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                var truck = new Truck(this);
                truck.SetPosition(field.GetCeil());
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
        if(this.GetSprites()[0].containsPoint(context.Point))
        {
            context.OnSelect(this);
            return true;
        }
        return false;
        }

    protected Destroy():void{
        PlaygroundHelper.Render.Remove(this);
        this._ceil.DestroyField();
        this.IsUpdatable = false;
        this.Fields.forEach(field=>{
            field.Destroy();
        });
    }

    public Update(viewX: number, viewY: number, zoom: number):void
    {
        if(!this.IsAlive())
        {
            this.Destroy();
            let crater = new Crater(this.BoundingBox);
            PlaygroundHelper.Playground.Items.push(crater);
            return;
        }

        super.Update(viewX,viewY,zoom);

        this.Fields.forEach(field=>{
            field.Update(viewX,viewY,zoom);
            this.Diamonds += field.Diamonds;
            field.Diamonds = 0;            
        });


        if(this._timer.IsElapsed())
        { 
            if(this.DisplayObjects[3].alpha < 0.25)
            {
                this.IsFading = false;
            }

            if(1 < this.DisplayObjects[3].alpha)
            {
                this.IsFading = true;
            }

            if(this.IsFading)
            {
                this.DisplayObjects[3].alpha -= 0.05;
            }

            if(!this.IsFading)
            {
                this.DisplayObjects[3].alpha += 0.05;
            }
        }
    }
}