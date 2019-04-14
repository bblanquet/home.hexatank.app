import { Headquarter } from "../Field/Headquarter";
import { InteractionContext } from "../Context/InteractionContext";
import { SelectableMenuItem } from "./SelectableMenuItem";

export class TruckMenuItem extends SelectableMenuItem{  
    private _hq:Headquarter;

    constructor(hq:Headquarter,){
        super('truckIcon');
        this._hq = hq;
    }

    public Select(context: InteractionContext): boolean      
    { 
        if(this._hq.Diamonds > 4){
            if(this._hq.CreateTruck()){
                this._hq.Diamonds -= 4;
            }
        }

        return true;
    }

}