import { AliveItem } from "../AliveItem";
import { Ceil } from "../Ceil";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Vehicle } from "../Unit/Vehicle";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { IField } from "./IField";


export class BlockingField extends AliveItem implements IField
{
 
    private _ceil:Ceil;
    
    constructor(ceil:Ceil, sprite:string){
        super();
        this._ceil = ceil;
        this._ceil.SetField(this);
        this.Z= 0;
        this.GenerateSprite(sprite);
        this.InitPosition(ceil.GetBoundingBox());
    }

    GetCeil(): Ceil {
        return this._ceil;
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
        return this._ceil.GetBoundingBox();
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
        this._ceil.DestroyField();
        this.IsUpdatable = false;
    }
}