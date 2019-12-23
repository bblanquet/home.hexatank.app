import { Cell } from "../Cell";
import { InteractionContext } from "../../Context/InteractionContext";
import { Archive } from "../../Utils/ResourceArchiver";
import { Field } from "./Field";      
import { CellState } from "../CellState";
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";

export class VolcanoField extends Field
{
    private _isIncreasingOpacity:boolean=false;

    constructor(ceil:Cell){
        super(ceil); 
        this.GetCell().SetField(this);
        this.Z= 1;
        this.GenerateSprite(Archive.nature.volcano);
        this.GenerateSprite(Archive.nature.volcanaoAnimation);

        this.GetSprites().forEach(sprite => {
            sprite.width = this.GetCell().GetBoundingBox().Width,
            sprite.height = this.GetCell().GetBoundingBox().Height
            sprite.anchor.set(0.5);
        });

        this.IsCentralRef = true;

        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
    }

    protected OnCellStateChanged(ceilState: CellState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState !== CellState.Hidden;
        });
    }

    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);

        this.SetProperty(Archive.nature.volcanaoAnimation,s=>{
            if(s.alpha < 0){
                this._isIncreasingOpacity = true;
            }

            if(0.6 <= s.alpha){
                this._isIncreasingOpacity = false;
            }

            s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01; 
        });
        
    };

    public GetBoundingBox(): BoundingBox {
        return this.GetCell().GetBoundingBox();
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

}