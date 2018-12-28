import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../InteractionContext";
import { Headquarter } from "../Headquarter";

export class TankMenuItem extends MenuItem
{
    private _hq:Headquarter;

    constructor(hq:Headquarter,unselected:string,selected:string){
        super(unselected,selected);
        this._hq = hq;
    }

    public Select(context: InteractionContext): boolean      
    {
        //console.log(`%c touchdown`,'color:blue;font-weight:bold;');
        
        if(this._hq.Diamonds > 4){
            if(this._hq.CreateTank()){
                this._hq.Diamonds -= 4;
            }
        }

        return true;
    }

}