import { InteractionContext } from "../Context/InteractionContext";
import { Headquarter } from "../Ceils/Field/Headquarter"; 
import { SelectableMenuItem } from "./SelectableMenuItem";
import { Archive } from "../Utils/ResourceArchiver";
import { PlaygroundHelper } from "../Utils/PlaygroundHelper";

export class TankMenuItem extends SelectableMenuItem 
{
    private _hq:Headquarter;

    constructor(hq:Headquarter){
        super(Archive.menu.tankButton); 
        this._hq = hq;
    }

    public Select(context: InteractionContext): boolean      
    {        
        if(this._hq.Diamonds >= PlaygroundHelper.Settings.TankPrice){
            if(this._hq.CreateTank()){
                this._hq.Diamonds -= PlaygroundHelper.Settings.TankPrice;
            }
        }
        return true;
    }

}