import { Vehicle } from "./Vehicle";
import { IHqContainer } from "../IHqContainer";
import { Headquarter } from "../Field/Headquarter";
import { AliveItem } from "../AliveItem";
import { ITimer } from "../Tools/ITimer";
import { Timer } from "../Tools/Timer";
import { Light } from "../Light";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Point } from "pixi.js";
import { Archive } from "../Tools/ResourceArchiver";

export class Truck extends Vehicle implements IHqContainer{
    Hq:Headquarter;
    private _lights:Array<Light>;
    private _lightShifts:Array<Point>;
    private _gatheredDiamonds:Array<string>;
    private _dimaondTimer:ITimer;
    private _diamondsCount:number=0; 
    private _lightTimer:ITimer;

    constructor(hq:Headquarter)
    {
        super();
        this.Hq = hq;
        this.Wheels = Archive.wheels;

        this.GenerateSprite(Archive.wheel)
        this.RootSprites.push(Archive.wheel);

        this._lightTimer = new Timer(4);
        this._lights = new Array<Light>();
        this._lights.push(new Light(this.GetBoundingBox()));
        this._lights.push(new Light(this.GetBoundingBox()));
        this._lights.push(new Light(this.GetBoundingBox()));

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
    
    public Destroy():void{
        super.Destroy();
        this._lights.forEach(light => {
            light.Destroy();
        });
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
        if(this._diamondsCount>0){
            this.UpdateLights();
        }
        for(let i = 0; i < this._lights.length;i++){
            if(this._lights[i].IsShowing)
            {
                this._lights[i].Update(viewX,viewY);
            }
        }
    }

    private UpdateLights():void {
        if (this._lightTimer.IsElapsed()) {
            this._lightShifts = [];
            this._lights.forEach(light => {
                if (!light.IsShowing) {
                    var randomX = Math.random();
                    var randomY = Math.random();
                    var randomXsign = Math.random();
                    var randomYsign = Math.random();
                    var quarter = PlaygroundHelper.Settings.Size / 4;
                    if (randomXsign < 0.5) {
                        randomX = -quarter * randomX;
                    }
                    else {
                        randomX = quarter * randomX;
                    }
                    if (randomYsign < 0.5) {
                        randomY = -quarter * randomY;
                    }
                    else {
                        randomY = quarter * randomY;
                    }
                    this._lightShifts.push(new Point(randomX,randomY));
                    light.Display(this.GetBoundingBox().GetCenter() + randomX, this.GetBoundingBox().GetMiddle() + randomY);
                }
            });
        }
    }
}