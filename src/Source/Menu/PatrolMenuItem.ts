import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../InteractionContext";
import { Vehicle } from "../Vehicle";
import { Item } from "../Item";
import { PlaygroundHelper } from "../PlaygroundHelper";

export class PatrolMenuItem extends MenuItem{

    private _vehicle:Vehicle;
    protected SelectionFunc:any;
    protected UnselectionFunc:any;

    constructor()
    {
        super('patrolIcon','hoverPatrolIcon');
        this.SelectionFunc = this.Selected.bind(this);
        this.UnselectionFunc = this.UnSelected.bind(this);
        PlaygroundHelper.OnVehiculeSelected.on(this.SelectionFunc);
        PlaygroundHelper.OnVehiculeUnSelected.on(this.UnselectionFunc);
    }

    private Selected(obj:any, item:Item):void
    {
        this._vehicle = <Vehicle> item;
        if(this._vehicle.IsPatroling())
        {
            this.DisplayObjects[0].alpha = 0;
            this.DisplayObjects[1].alpha = 1;
        }
        else
        {
            this.DisplayObjects[0].alpha = 1;
            this.DisplayObjects[1].alpha = 0;
        }
    }

    private UnSelected(obj:any, item:Item):void
    {
        this._vehicle = null;
        this.Hide();
    }

    public Select(context: InteractionContext): boolean 
    {
       if(this._vehicle != null)
       {
            this._vehicle.SetPatrol(context);
            this.Change();
       }
       return true;
    }

}