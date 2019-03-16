import { Vehicle } from "./Vehicle";
import { IHqContainer } from "../IHqContainer";
import { Headquarter } from "../Field/Headquarter";
import { AliveItem } from "../AliveItem";
import { ITimer } from "../Tools/ITimer";
import { Timer } from "../Tools/Timer";

export class Truck extends Vehicle implements IHqContainer{
    Hq:Headquarter;
    private _gatheredDiamonds:Array<string>;
    private _dimaondTimer:ITimer;
    private _diamondsCount:number=0; 
    
    constructor(hq:Headquarter)
    {
        super();
        this.Hq = hq;
        this.Wheels = ['./tank/wheel1.svg','./tank/wheel2.svg','./tank/wheel3.svg',
                    './tank/wheel4.svg','./tank/wheel5.svg','./tank/wheel6.svg',
                    './tank/wheel7.svg','./tank/wheel8.svg'
                    ];

        this.GenerateSprite('./tank/wheel.svg')
        this.RootSprites.push('./tank/wheel.svg');
        
        this._dimaondTimer = new Timer(30);
        this.Wheels.forEach(wheel =>{
            this.GenerateSprite(wheel);
            this.RootSprites.push(wheel);
        });

        this._gatheredDiamonds = ['./truck/diamonds/diamonds1.svg','./truck/diamonds/diamonds2.svg',
    './truck/diamonds/diamonds3.svg','./truck/diamonds/diamonds4.svg','./truck/diamonds/diamonds5.svg',
'./truck/diamonds/diamonds6.svg']

        this.GenerateSprite(this.Hq.GetSkin().GetTruck());
        this.RootSprites.push(this.Hq.GetSkin().GetTruck());

        this._gatheredDiamonds.forEach(diamond=>{
            this.GenerateSprite(diamond,e=>e.alpha = 0);
            this.RootSprites.push(diamond);
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
                this.GetCurrentSprites()[this._gatheredDiamonds[this._diamondsCount]].alpha = 1;
                this._diamondsCount = (this._diamondsCount+1) % this._gatheredDiamonds.length; 
            }
        }
    } 

    public Unload():number{
        var diamonds = this._diamondsCount;
        this._diamondsCount = 0;
        this._gatheredDiamonds.forEach(sprite=>{
            this.GetCurrentSprites()[sprite].alpha = 0;
        });
        return diamonds;
    }

    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);
    }
}