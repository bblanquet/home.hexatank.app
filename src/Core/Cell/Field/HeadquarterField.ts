import { InteractionContext } from "../../Context/InteractionContext";
import { Cell } from "../Cell";
import { Timer } from "../../Utils/Timer"; 
import { Headquarter } from "./Headquarter"; 
import { Field } from "./Field";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { Truck } from "../../Items/Unit/Truck";
import { BoundingBox } from "../../Utils/BoundingBox";
import { GameSettings } from "../../Utils/GameSettings"; 

export class HeadQuarterField extends Field
{
    private _timer:Timer;
    IsFading:boolean;
    Diamonds:number=0; 
 
    constructor(private _hq:Headquarter,ceil:Cell,sprite:string){
        super(ceil);
        this.GetCell().SetField(this);
        this.Z= -1;
        this._timer = new Timer(3);
        this.GenerateSprite(sprite);
        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
    }

    public Destroy(): void {
        super.Destroy();
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
        this.GetCell().DestroyField();
    }

    public Support(vehicule: Vehicle): void 
    {
        vehicule.TranslationSpeed = GameSettings.TranslationSpeed*3;
        vehicule.RotationSpeed = GameSettings.RotationSpeed;
        vehicule.Attack = GameSettings.Attack;

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
        return this.GetCell().GetBoundingBox();
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