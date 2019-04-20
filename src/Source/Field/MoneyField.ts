import { Item } from "../Item";
import { IField } from "./IField";
import { Ceil } from "../Ceil";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { Vehicle } from "../Unit/Vehicle";
import { Archive } from "../Tools/ResourceArchiver";
import { Timer } from "../Tools/Timer";
import { Truck } from "../Unit/Truck";
import { Light } from "../Light";

export class MoneyField extends Item implements IField
{ 
    private _ceil:Ceil;
    private _timer:Timer;
    private _light:Light;

    constructor(ceil:Ceil){
        super();
        this._ceil=ceil;
        this._ceil.SetField(this);
        this.Z= 1; 
        this._timer = new Timer(10);
        this._light = new Light(ceil.GetBoundingBox());
        this._light.Hide();
        this.GenerateSprite(Archive.bonus.emptyMoney);
        this.GenerateSprite(Archive.bonus.fullMoney,s=>s.alpha=0);      
        this.InitPosition(ceil.GetBoundingBox());
    }

    public GetCeil(): Ceil {
        return this._ceil;
    }

    private IsFull():boolean{
        return this.GetCurrentSprites()[Archive.bonus.fullMoney].alpha >= 1;
    }

    private SetEmpty():void{
        this.SetProperty(Archive.bonus.fullMoney, s=>s.alpha = 0);
    }

    public GetBoundingBox(): BoundingBox {
        return this._ceil.GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    Support(vehicule: Vehicle): void {
        if(this.IsFull())
        {
            if(vehicule instanceof Truck){
                let truck = vehicule as Truck;
                truck.Hq.Diamonds += 1;
                this.SetEmpty();
                this._light.Hide();
            }
        }

        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;
        vehicule.Attack = PlaygroundHelper.Settings.Attack;
    }    

    IsDesctrutible(): boolean {
        return false;
    }

    IsBlocking(): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number): void 
    {
        super.Update(viewX,viewY);

        if(this.IsFull()){
            this._light.Update(viewX,viewY);
        }

        if(!this.IsFull())
        {
            if(this._timer.IsElapsed())
            {
                this.SetProperty(Archive.bonus.fullMoney,s=>s.alpha += 0.02);
                if(this.GetCurrentSprites()[Archive.bonus.fullMoney].alpha >= 1)
                {
                    this._light.Display();
                }
            }
        }

    }

}