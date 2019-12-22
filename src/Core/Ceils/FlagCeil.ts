import { BoundingBox } from '../Utils/BoundingBox';
import { Archive } from '../Utils/ResourceArchiver';
import { Ceil } from './Ceil';
import { Item } from '../Items/Item';
import { InteractionContext } from '../Context/InteractionContext';

export class FlagCeil extends Item{

    private _ceil:Ceil;
    private _isIncreasingOpacity:boolean=false;

    constructor(ceil:Ceil){
        super();
        this.Z = 2;
        this.GenerateSprite(Archive.flagCell,e=>{
            e.anchor.set(0.50);
            e.alpha = 0;
        });
        this._ceil = ceil;
        this.InitPosition(ceil.GetBoundingBox());
        this.IsCentralRef = true;
    }

    public GetCeil():Ceil{
        return this._ceil;
    }

    public SetCeil(ceil:Ceil):void{
        this._ceil = ceil;
        this.InitPosition(this._ceil.GetBoundingBox());
    }
    public GetBoundingBox(): BoundingBox {
        return this._ceil.GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);

        this.SetProperty(Archive.flagCell,s=>{
            if(s.alpha < 0){
                this._isIncreasingOpacity = true;
            }

            if(1 <= s.alpha){
                this._isIncreasingOpacity = false;
            }

            s.alpha += this._isIncreasingOpacity ? 0.07 : -0.07; 
        });
        
    };

}