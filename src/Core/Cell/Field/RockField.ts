import { AliveItem } from "../../Items/AliveItem";
import { Cell } from "../Cell";
import { InteractionContext } from "../../Context/InteractionContext";
import { AliveField } from "./AliveField";
import { CellState } from "../CellState"; 
import { Vehicle } from "../../Items/Unit/Vehicle";      
import { BoundingBox } from "../../Utils/BoundingBox";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";

export class BlockingField extends AliveField 
{
    constructor(ceil:Cell, sprite:string){
        super(ceil);
        this.GetCell().SetField(this);
        this.Z= 1;
        this.GenerateSprite(sprite);
        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
    }

    protected OnCellStateChanged(ceilState: CellState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState !== CellState.Hidden;
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
        return this.GetCell().GetBoundingBox();
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
        this.GetCell().DestroyField();
        this.IsUpdatable = false;
    }
}