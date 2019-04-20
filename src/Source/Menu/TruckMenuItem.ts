import { Headquarter } from "../Field/Headquarter";
import { InteractionContext } from "../Context/InteractionContext";
import { SelectableMenuItem } from "./SelectableMenuItem";
import { Archive } from "../Tools/ResourceArchiver";

export class TruckMenuItem extends SelectableMenuItem{  
    private _hq:Headquarter;

    constructor(hq:Headquarter,){
        super(Archive.menu.truckButton);
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