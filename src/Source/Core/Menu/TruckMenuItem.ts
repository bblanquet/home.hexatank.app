import { Headquarter } from "../Ceils/Field/Headquarter"; 
import { InteractionContext } from "../Context/InteractionContext";
import { SelectableMenuItem } from "./SelectableMenuItem";
import { Archive } from "../Utils/ResourceArchiver";
import { PlaygroundHelper } from "../Utils/PlaygroundHelper";

export class TruckMenuItem extends SelectableMenuItem{  
    private _hq:Headquarter;

    constructor(hq:Headquarter,){
        super(Archive.menu.truckButton);
        this._hq = hq;
    }

    public Select(context: InteractionContext): boolean      
    { 
        if(this._hq.Diamonds >= PlaygroundHelper.Settings.TruckPrice){
            if(this._hq.CreateTruck()){
                this._hq.Diamonds -= PlaygroundHelper.Settings.TruckPrice;
            }
        }

        return true;
    }

}