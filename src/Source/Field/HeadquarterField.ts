import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Ceil } from "../Ceil";
import { Vehicle } from "../Unit/Vehicle";
import { Truck } from "../Unit/Truck";
import { Timer } from "../Tools/Timer"; 
import { Headquarter } from "./Headquarter";
import { Field } from "./Field";

export class HeadQuarterField extends Field
{
    private _timer:Timer;
    IsFading:boolean;
    Diamonds:number=0; 

    constructor(private _hq:Headquarter,ceil:Ceil,sprite:string){
        super(ceil);
        this.GetCeil().SetField(this);
        this.Z= 0;
        this._timer = new Timer(3);
        this.GenerateSprite(sprite);
        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCeil().IsVisible();});
    }

    public Destroy(): void {
        super.Destroy();
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
        this.GetCeil().DestroyField();
    }

    public Support(vehicule: Vehicle): void 
    {
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;
        vehicule.Attack = PlaygroundHelper.Settings.Attack;

        if(vehicule instanceof Truck)
        {
            var truck = vehicule as Truck;
            if(!truck.IsEnemy(this._hq))
            {
                this.Diamonds = truck.Unload();
            }
        }
    }
    
    IsDesctrutible(): boolean {
        return false;
    }

    IsBlocking(): boolean {
        return false;
    }

    public GetBoundingBox(): BoundingBox{
        return this.GetCeil().GetBoundingBox();
    }

    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number): void {
        super.Update(viewX,viewY);

        if(this._timer.IsElapsed())
        { 
            if(this.GetSprites()[0].alpha < 0)
            {
                this.IsFading = false;
            }

            if(1 < this.GetSprites()[0].alpha)
            {
                this.IsFading = true;
            }

            if(this.IsFading)
            {
                this.GetSprites()[0].alpha -= 0.05;
            }

            if(!this.IsFading)
            {
                this.GetSprites()[0].alpha += 0.05;
            }
        }
    }
}
