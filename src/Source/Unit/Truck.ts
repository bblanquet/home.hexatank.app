import { Vehicle } from "./Vehicle";
import { IHqContainer } from "../IHqContainer";
import { Headquarter } from "../Ceils/Field/Headquarter";
import { AliveItem } from "../AliveItem";
import { ITimer } from "../Tools/ITimer";
import { Timer } from "../Tools/Timer";
import { Light } from "../Light";
import { Archive } from "../Tools/ResourceArchiver";
import { CeilState } from "../Ceils/CeilState";

export class Truck extends Vehicle implements IHqContainer{ 
    Hq:Headquarter; 
    private _light:Light;
    private _gatheredDiamonds:Array<string>;
    private _dimaondTimer:ITimer;
    private _diamondsCount:number=0; 

    constructor(hq:Headquarter)
    {
        super();
        this.Hq = hq;
        this.Wheels = Archive.wheels;

        this.GenerateSprite(Archive.wheel)
        this.RootSprites.push(Archive.wheel);

        this._dimaondTimer = new Timer(30);
        this.Wheels.forEach(wheel =>{
            this.GenerateSprite(wheel);
            this.RootSprites.push(wheel);
        });

        this._gatheredDiamonds = Archive.diamonds;

        this.GenerateSprite(this.Hq.GetSkin().GetTruck());
        this.RootSprites.push(this.Hq.GetSkin().GetTruck());

        this._gatheredDiamonds.forEach(diamond=>{
            this.GenerateSprite(diamond,e=>e.alpha = 0);
            this.RootSprites.push(diamond);
        });

        this._light = new Light(this.BoundingBox);

        this.GetSprites().forEach(sprite => 
            {
                sprite.width = this.BoundingBox.Width,
                sprite.height = this.BoundingBox.Height
                sprite.anchor.set(0.5);
            }
        );
        this.IsCentralRef = true;
    }

    public IsLoaded():boolean{
        return this._diamondsCount === 5; 
    }

    public Destroy():void{
        super.Destroy();
        this._light.Destroy();
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

    protected OnCeilStateChanged(ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible;
        });
    }

    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);
        if(0 < this._diamondsCount){
            if(!this._light.IsVisible()){
                this._light.Display();
            }
        }
        else
        {
            if(this._light.IsVisible()){
                this._light.Hide();
            }
        }

        this._light.GetSprites().forEach(s=>s.visible=this.GetCurrentCeil().IsVisible());
        this._light.Update(viewX,viewY);
    }
}