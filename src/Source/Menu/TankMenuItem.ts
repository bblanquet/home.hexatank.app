import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";
import { Headquarter } from "../Field/Headquarter";

export class TankMenuItem extends MenuItem 
{
    private _hq:Headquarter;

    constructor(hq:Headquarter){
        super('tankIcon','tankIcon'); 
        this._hq = hq;
    }

    public Select(context: InteractionContext): boolean      
    {        
        if(this._hq.Diamonds > 4){
            if(this._hq.CreateTank()){
                this._hq.Diamonds -= 4;
                //context.OnSelect(this);
            }
        }
        return true;
    }

}