import { OrderState } from "./OrderState";
import { Vehicle } from "../Unit/Vehicle";
import { Ceil } from "../Ceil";
import { SimpleOrder } from "./SimpleOrder";
import { Order } from "./Order";
import { BasicItem } from "../BasicItem";
import { isNullOrUndefined } from "util";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Archive } from "../Tools/ResourceArchiver";

export class PatrolOrder extends Order{
    private _currentPatrolCeil:Ceil;
    private _simpleOrder:SimpleOrder; 
    private _patrols:Array<BasicItem>;

    constructor(private _patrolCeils:Array<Ceil>,private _v:Vehicle)
    { 
        super();
        this._patrols = new Array<BasicItem>();
        this.CreatePath();
    }

    public Cancel(): void {
        super.Cancel();
        this._patrols.forEach(patrol=>{
            patrol.Destroy();
        });
        this._patrols = [];
        
        if(!isNullOrUndefined(this._simpleOrder))
        {
            this._simpleOrder.Cancel();
        }
    }

    private CreatePath():void
    {
        if(!isNullOrUndefined(this._patrolCeils) && 0 < this._patrolCeils.length){
            this._patrolCeils.forEach(ceil => {
                    const pathItem = new BasicItem(ceil.GetBoundingBox(),Archive.direction.patrol);
                    
                    pathItem.SetDisplayTrigger(this._v.IsSelected.bind(this._v));
                    pathItem.SetVisible(this._v.IsAlive.bind(this._v));

                    this._patrols.push(pathItem);
                    PlaygroundHelper.Playground.Items.push(pathItem);
                }
            );
        }
    }

    public Do(): void 
    {
        if(this.State === OrderState.None)
        {
            this._currentPatrolCeil = this._patrolCeils[0]; 
            this.State = OrderState.Pending;
            this.StartMoving();
        }

        if(this._simpleOrder.IsDone())
        {
            var index = (this._patrolCeils.indexOf(this._currentPatrolCeil)+1) % this._patrolCeils.length;
            this._currentPatrolCeil = this._patrolCeils[index];
            this.StartMoving();
        }
        else
        {
            this._simpleOrder.Do();
        }
    }

    private StartMoving() {
        this._simpleOrder = new SimpleOrder(this._currentPatrolCeil, this._v);
        this._simpleOrder.Do();
    }
}