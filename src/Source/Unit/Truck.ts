import { Vehicle } from "./Vehicle";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Sprite } from "pixi.js";
import { IHqContainer } from "../IHqContainer";
import { Headquarter } from "../Field/Headquarter";
import { AliveItem } from "../AliveItem";
import { ITimer } from "../Tools/ITimer";
import { Timer } from "../Tools/Timer";

export class Truck extends Vehicle implements IHqContainer{
    Hq:Headquarter;
    private _gatheredDiamonds:Array<Sprite>;
    private _dimaondTimer:ITimer;
    private _diamondsCount:number=0; 
    
    constructor(hq:Headquarter)
    {
        super();
        this.Hq = hq;
        const wheels = ['./tank/wheel1.svg','./tank/wheel2.svg','./tank/wheel3.svg',
                    './tank/wheel4.svg','./tank/wheel5.svg','./tank/wheel6.svg',
                    './tank/wheel7.svg','./tank/wheel8.svg'
                    ];

        const wheelBottom = PlaygroundHelper.SpriteProvider.GetSprite('./tank/wheel.svg');
        this.DisplayObjects.push(wheelBottom);
        this.RootSprites.push(wheelBottom);
        
        this._dimaondTimer = new Timer(30);
        wheels.forEach(wheel =>{
        let sprite = PlaygroundHelper.SpriteProvider.GetSprite(wheel);
        this.Wheels.push(sprite);
        this.DisplayObjects.push(sprite);
        this.RootSprites.push(sprite);
        });

        let diamonds = ['./truck/diamonds/diamonds1.svg','./truck/diamonds/diamonds2.svg',
    './truck/diamonds/diamonds3.svg','./truck/diamonds/diamonds4.svg','./truck/diamonds/diamonds5.svg',
'./truck/diamonds/diamonds6.svg']

        var sprite = this.Hq.GetSkin().GetTruck();
        this.DisplayObjects.push(sprite);
        this.RootSprites.push(sprite);

        this._gatheredDiamonds = new Array<Sprite>();
        diamonds.forEach(diamond=>{
            var sprite =PlaygroundHelper.SpriteProvider.GetSprite(diamond); 
            sprite.alpha = 0;
            this._gatheredDiamonds.push(sprite);
            this.DisplayObjects.push(sprite);
            this.RootSprites.push(sprite);
        });

        //make pivot sprite center
        this.GetSprites().forEach(sprite => {
        sprite.width = this.BoundingBox.Width,
        sprite.height = this.BoundingBox.Height
        sprite.anchor.set(0.5);
        });
        this.IsCentralRef = true;
    }

    public IsLoaded():boolean{
        return this._diamondsCount === 5; 
    }

    protected OnCeilChanged(): void {
    }    
    
    private IsHqContainer(item: any):item is IHqContainer{
        return 'Hq' in item;
    }

    public IsEnemy(item: AliveItem): boolean {
        if(this.IsHqContainer(item as any))
        {
            return (<IHqContainer>(item as any)).Hq !== this.Hq;
        }
        else if(item instanceof Headquarter)
        {
            return (<Headquarter>(item as any)) !== this.Hq;
        }
        return false;
    }

    public Load():void
    {
        if(this._dimaondTimer.IsElapsed())
        {
            if(!this.IsLoaded())
            {
                this._gatheredDiamonds[this._diamondsCount].alpha = 1;
                this._diamondsCount = (this._diamondsCount+1) % this._gatheredDiamonds.length; 
            }
        }
    } 

    public Unload():number{
        var diamonds = this._diamondsCount;
        this._diamondsCount = 0;
        this._gatheredDiamonds.forEach(sprite=>{
            sprite.alpha = 0;
        });
        return diamonds;
    }

    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);
    }
}