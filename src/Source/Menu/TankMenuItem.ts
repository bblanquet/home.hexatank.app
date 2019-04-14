import { InteractionContext } from "../Context/InteractionContext";
import { Headquarter } from "../Field/Headquarter";
import { SelectableMenuItem } from "./SelectableMenuItem";

export class TankMenuItem extends SelectableMenuItem 
{
    private _hq:Headquarter;

    constructor(hq:Headquarter){
        super('tankIcon'); 
        this._hq = hq;
    }

    public Select(context: InteractionContext): boolean      
    {        
        if(this._hq.Diamonds > 4){
            if(this._hq.CreateTank()){
                this._hq.Diamonds -= 4;
            }
        }
        return true;
    }

}