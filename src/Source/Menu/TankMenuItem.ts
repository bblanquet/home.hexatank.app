import { InteractionContext } from "../Context/InteractionContext";
import { Headquarter } from "../Ceils/Field/Headquarter"; 
import { SelectableMenuItem } from "./SelectableMenuItem";
import { Archive } from "../Tools/ResourceArchiver";

export class TankMenuItem extends SelectableMenuItem 
{
    private _hq:Headquarter;

    constructor(hq:Headquarter){
        super(Archive.menu.tankButton); 
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