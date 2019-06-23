import { Order } from "./Order";
import { Tank } from "../../Unit/Tank";
import { AliveItem } from "../../AliveItem";
import { BasicItem } from "../../BasicItem";
import { OrderState } from "./OrderState"; 
import { Ceil } from "../../Ceils/Ceil";
import { Archive } from "../../Tools/ResourceArchiver";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { SimpleOrder } from "./SimpleOrder";

export class TargetOrder extends Order{
    private _targetDisplay:BasicItem;
    private _currentOrder:SimpleOrder; 
    private _currentCeil:Ceil;

    constructor(private _v:Tank, private _target:AliveItem){
        super();
        this._v.SetMainTarget(this._target);
    }

    public Do(): void {

        if(this._target !== this._v.GetMainTarget()){
            this.Cancel();
            return;
        }

        if(this.State === OrderState.None)
        {
            this._currentCeil = this._target.GetCurrentCeil();
            this._currentOrder = new SimpleOrder(this._currentCeil,this._v); 
            this.State = OrderState.Pending;
            this.ShowUi();
        }

        if(this._target.GetCurrentCeil() !== this._currentCeil
            && !this._v.HasNextCeil())
        {
            this._currentOrder.Cancel();
            this._currentCeil = this._target.GetCurrentCeil();
            this._currentOrder = new SimpleOrder(this._currentCeil,this._v); 
        }

        if(this._currentOrder.IsDone())
        {
            if(this._currentOrder.GetState() !== OrderState.Passed)
            {
                this._currentOrder = new SimpleOrder(this._currentCeil,this._v); 
            }
            else
            {
                this.State = OrderState.Passed;
                return;
            }
        }
        else
        {
            this._currentOrder.Do();
        }
    }

    public Cancel(): void {
        super.Cancel();
        this._target.Destroy();
    }

    private ShowUi() {
        this._targetDisplay = new BasicItem(this._target.GetBoundingBox(), Archive.direction.target,4);
        this._targetDisplay.SetDisplayTrigger(this._v.IsSelected.bind(this._v));
        this._targetDisplay.SetVisible(()=>
            this._v.IsAlive() 
            && this._target.IsAlive()
            && this._v.GetMainTarget() === this._target );
        PlaygroundHelper.Playground.Items.push(this._targetDisplay);
    }
}