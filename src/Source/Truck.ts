import { Vehicle } from "./Vehicle";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { BoundingBox } from "./BoundingBox";
import { Dust } from "./Dust";
import { Sprite } from "pixi.js";

export class Truck extends Vehicle{

    private _gatheredDiamonds:Array<Sprite>;
    private _timing:number=0;
    private _timeBuffer:number=30;
    private _diamondsCount:number=0;
    
    constructor()
    {
        super();
        let wheels = ['track1.png','track2.png','track3.png',
        'track4.png','track5.png','track6.png',
        'track7.png'
        ];
        wheels.forEach(wheel =>{
        let sprite = new PIXI.Sprite(PlaygroundHelper.Render.Textures[wheel]);
        this.Wheels.push(sprite);
        this.DisplayObjects.push(sprite);
        this.RootSprites.push(sprite);
        });

        let diamonds = ['gatheredDiamond1.png','gatheredDiamond2.png',
    'gatheredDiamond3.png','gatheredDiamond4.png','gatheredDiamond5.png',
'gatheredDiamond6.png']

        var sprite = new PIXI.Sprite(PlaygroundHelper.Render.Textures["truck1.png"]);
        this.DisplayObjects.push(sprite);
        this.RootSprites.push(sprite);

        this._gatheredDiamonds = new Array<Sprite>();
        diamonds.forEach(diamond=>{
            var sprite = new PIXI.Sprite(PlaygroundHelper.Render.Textures[diamond]);
            sprite.alpha = 0;
            this._gatheredDiamonds.push(sprite);
            this.DisplayObjects.push(sprite);
            this.RootSprites.push(sprite);
        });

        //make pivot sprite center
        this.GetSprites().forEach(sprite => {
        sprite.width = this.BoundingBox.Width,
        sprite.height = this.BoundingBox.Height
        sprite.pivot.set(PlaygroundHelper.Settings.Pivot
            ,PlaygroundHelper.Settings.Pivot);//beurk
        });
        this.IsCentralRef = true;
    }

    public IsLoaded():boolean{
        return this._diamondsCount === 5; 
    }

    protected OnCeilChanged(): void {
        
    }    
    
    CreateDust(x: number, y: number): void {
        var b = new BoundingBox();
        b.X = x;
        b.Y = y;
        b.Width = this.GetBoundingBox().Width/5;
        b.Height = this.GetBoundingBox().Width/5;

        var dust = new Dust(b);
        PlaygroundHelper.Render.Add(dust);
        this.Dusts.push(dust);    
    }

    public Load():void
    {
        this._timing += 1;
        if(this._timing % this._timeBuffer === 0)
        {
            if(!this.IsLoaded())
            {
                this._gatheredDiamonds[this._diamondsCount].alpha = 1;
                this._diamondsCount = (this._diamondsCount+1) % this._gatheredDiamonds.length; 
            }
        }

        console.log(`LOAD ${this._diamondsCount}`,'font-weiht:bold;color:red;')
    }

    public Unload():number{
        var diamonds = this._diamondsCount;
        this._diamondsCount = 0;
        this._gatheredDiamonds.forEach(sprite=>{
            sprite.alpha = 0;
        });
        return diamonds;
    }

    public Update(viewX: number, viewY: number, zoom: number):void
    {
        super.Update(viewX,viewY,zoom);

        //console.log(`%c Detect ${} `,'color:blue;font-weight:bold;');

        if(this.CurrentCeil.Field != null)
        {
            this.CurrentCeil.Field.Support(this); 
        }
    }}