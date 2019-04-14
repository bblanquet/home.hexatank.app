import { Item } from "../Item";
import { IField } from "./IField";
import { Vehicle } from "../Unit/Vehicle";
import { Ceil } from "../Ceil";
import { InteractionContext } from "../Context/InteractionContext";
import { BoundingBox } from "../BoundingBox";
import { Archive } from "../Tools/ResourceArchiver";

export class WaterField extends Item implements IField
{
    private _ceil:Ceil;
    private _isIncreasingOpacity:boolean=false;

    constructor(ceil:Ceil){
        super();
        this._ceil = ceil;
        this._ceil.SetField(this);
        this.Z= 0;
        this.GenerateSprite(Archive.nature.water.middle.background);
        this.GenerateSprite(Archive.nature.water.middle.wave);
        this.GenerateSprite(Archive.nature.water.leaf);

        this.GetSprites().forEach(sprite => {
            sprite.width = this._ceil.GetBoundingBox().Width,
            sprite.height = this._ceil.GetBoundingBox().Height
            sprite.anchor.set(0.5);
        });

        this.IsCentralRef = true;

        this.InitPosition(ceil.GetBoundingBox());
    }

    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);
        this.SetBothProperty(Archive.nature.water.leaf,s=>s.rotation += 0.005);

        this.SetProperty(Archive.nature.water.middle.wave,s=>{
            if(s.alpha < 0.4){
                this._isIncreasingOpacity = true;
            }

            if(1 <= s.alpha){
                this._isIncreasingOpacity = false;
            }

            s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01; 
        });
        
    };

    public GetBoundingBox(): BoundingBox {
        return this._ceil.GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    Support(vehicule: Vehicle): void {
        throw new Error("not supposed to happen");
    }    
    
    IsDesctrutible(): boolean {
        return false;
    }
    IsBlocking(): boolean {
        return true;
    }
    GetCeil(): Ceil {
        return this._ceil;
    }


}