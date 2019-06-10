import { AliveItem } from "../AliveItem";
import { Ceil } from "../Ceil";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Vehicle } from "../Unit/Vehicle";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { AliveField } from "./AliveField";
import { CeilState } from "../CeilState";

export class BlockingField extends AliveField
{
    constructor(ceil:Ceil, sprite:string){
        super(ceil);
        this.GetCeil().SetField(this);
        this.Z= 0;
        this.GenerateSprite(sprite);
        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCeil().IsVisible();});
    }

    protected OnCeilStateChanged(ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible || ceilState === CeilState.HalfVisible;
        });
    }

    Support(vehicule: Vehicle): void {
        //nothing
    }
    IsDesctrutible(): boolean {
        return true;
    }

    IsBlocking(): boolean {
        return true;
    }

    public IsEnemy(item: AliveItem): boolean {
        return true;
    }

    public GetBoundingBox(): BoundingBox {
        return this.GetCeil().GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        //nothing
        return false;
    }

    public Update(viewX: number, viewY: number):void{
        if(!this.IsAlive())
        {
            this.Destroy();
            return;
        }
        super.Update(viewX,viewY);
    }

    public Destroy():void{
        super.Destroy();
        PlaygroundHelper.Render.Remove(this);
        this.GetCeil().DestroyField();
        this.IsUpdatable = false;
    }
}