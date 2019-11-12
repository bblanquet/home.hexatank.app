import { AliveItem } from "../../Items/AliveItem";
import { Ceil } from "../Ceil";
import { InteractionContext } from "../../Context/InteractionContext";
import { AliveField } from "./AliveField";
import { CeilState } from "../CeilState"; 
import { Vehicle } from "../../Items/Unit/Vehicle";
import { BoundingBox } from "../../Utils/BoundingBox";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";

export class BlockingField extends AliveField
{
    constructor(ceil:Ceil, sprite:string){
        super(ceil);
        this.GetCeil().SetField(this);
        this.Z= 1;
        this.GenerateSprite(sprite);
        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCeil().IsVisible();});
    }

    protected OnCellStateChanged(ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState !== CeilState.Hidden;
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