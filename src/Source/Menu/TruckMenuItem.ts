import { MenuItem } from "./MenuItem";
import { Headquarter } from "../Field/Headquarter";
import { InteractionContext } from "../Context/InteractionContext";

export class TruckMenuItem extends MenuItem{  
    private _hq:Headquarter;

    constructor(hq:Headquarter,){
        super('truckIcon','truckIcon');
        this._hq = hq;
    }

    public Select(context: InteractionContext): boolean      
    { 
        //console.log(`%c touchdown`,'color:blue;font-weight:bold;');
        
        if(this._hq.Diamonds > 4){
            if(this._hq.CreateTruck()){
                this._hq.Diamonds -= 4;
            }
        }

        return true;
    }

}