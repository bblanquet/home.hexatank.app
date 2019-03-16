import { PlaygroundHelper } from "../PlaygroundHelper";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { Ceil } from "../Ceil";
import { Item } from "../Item";
import { IField } from "./IField";
import { Vehicle } from "../Unit/Vehicle"; 
import { Truck } from "../Unit/Truck";
import { Timer } from "../Tools/Timer";

export class DiamondField extends Item implements IField
{
    private _ceil:Ceil;
    private _timer:Timer;
    IsFading:boolean;
    
    constructor(ceil:Ceil){
        super();
        this._ceil = ceil;
        this._ceil.SetField(this);
        this.Z= 0;
        this._timer = new Timer(3);
        this.GenerateSprite('./diamondCell.svg');
        this.InitPosition(ceil.GetBoundingBox());
    }

    public Destroy(): void {
        super.Destroy();
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
        this._ceil.DestroyField();
    }

    public Support(vehicule:Vehicle): void 
    {
        vehicule.TranslationSpeed = PlaygroundHelper.Settings.TranslationSpeed;
        vehicule.RotationSpeed = PlaygroundHelper.Settings.RotationSpeed;
        vehicule.Attack = PlaygroundHelper.Settings.Attack;

        if(vehicule instanceof Truck)
        {
            var truck = vehicule as Truck;
            truck.Load();
        }
    }
    public IsDesctrutible(): boolean {
        return false;
    }

    IsBlocking(): boolean {
        return false;
    }
    
    GetCeil(): Ceil {
        return this._ceil;
    }

    public GetBoundingBox(): BoundingBox{
        return this._ceil.GetBoundingBox();
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