import { LiteEvent } from './../../Utils/LiteEvent';
import { InteractionContext } from "../../Context/InteractionContext";
import { Ceil } from "../Ceil";
import { Timer } from "../../Utils/Timer"; 
import { Archive } from "../../Utils/ResourceArchiver";
import { Field } from "./Field"; 
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { Truck } from "../../Items/Unit/Truck";
import { BoundingBox } from "../../Utils/BoundingBox";

export class DiamondField extends Field
{
    private _timer:Timer;
    IsFading:boolean;
    public Loaded:LiteEvent<{}> = new LiteEvent<{}>();

    constructor(ceil:Ceil){
        super(ceil);
        this.GetCeil().SetField(this);
        this.Z= 0;
        this._timer = new Timer(3);
        this.GenerateSprite(Archive.diamondCell);
        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCeil().IsVisible();});
    }

    public Destroy(): void {
        super.Destroy();
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
        this.GetCeil().DestroyField();
    }

    public Support(vehicule:Vehicle): void 
    {
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;
        vehicule.Attack = PlaygroundHelper.Settings.Attack;

        if(vehicule instanceof Truck)
        {
            var truck = vehicule as Truck;
            if(truck.Load()){
                this.Loaded.trigger(this,{});
            }
        }
    }
    public IsDesctrutible(): boolean {
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

    public Update(viewX: number, viewY: number): void 
    {
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