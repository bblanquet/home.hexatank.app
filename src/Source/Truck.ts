import { Vehicle } from "./Vehicle";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { BoundingBox } from "./BoundingBox";
import { Dust } from "./Dust";
import { Sprite } from "pixi.js";
import { IHqContainer } from "./IHqContainer";
import { Headquarter } from "./Headquarter";
import { AliveItem } from "./AliveItem";

export class Truck extends Vehicle implements IHqContainer{
    Hq:Headquarter;
    private _gatheredDiamonds:Array<Sprite>;
    private _timing:number=0;
    private _timeBuffer:number=30;
    private _diamondsCount:number=0;
    
    constructor(hq:Headquarter)
    {
        super();
        this.Hq = hq;
        let wheels = ['tankWheel1','tankWheel2','tankWheel3',
                    'tankWheel4','tankWheel5','tankWheel6',
                    'tankWheel7'
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

        var sprite = this.Hq.GetSkin().GetTruck();
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
    
    public IsEnemy(item: AliveItem): boolean {
        var hqContainer = item as any as IHqContainer;
        if(hqContainer != null)
        {
            return hqContainer.Hq !== this.Hq;
        }
        return false;
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
        this.CurrentCeil.Field.Support(this); 
    }}