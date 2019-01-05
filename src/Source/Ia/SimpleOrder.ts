import { OrderState } from "./OrderState";
import { Vehicle } from "../Vehicle";
import { Ceil } from "../Ceil";
import { isNullOrUndefined, isNull } from "util";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { CeilFinder } from "../CeilFinder";
import { Order } from "./Order";
import { BasicItem } from "../BasicItem";
import { Sprite } from "pixi.js";

export class SimpleOrder extends Order{
    protected CurrentCeil:Ceil;
    protected Ceils:Array<Ceil>;
    private _ceilFinder:CeilFinder;
    private _path:Array<BasicItem>;

    constructor(protected Dest:Ceil,private _v:Vehicle)
    {
        super();
        this.Ceils = new Array<Ceil>();
        this._ceilFinder = new CeilFinder();
        this._path = [];
    }

    public Do(): void 
    {
        if(!this.Init())
        {
            return;
        }

        if(this.CurrentCeil === this._v.GetCurrentCeil())
        {
            this._path[0].Destroy();
            this._path.splice(0, 1);
            
            if(this.CurrentCeil === this.Dest)
            {
                this.State = OrderState.Passed;
            }
            else
            {
                this.GoNextCeil();
            }
        }
    }

    private GoNextCeil() {
        var ceil = this.GetNextCeil();
        if (isNull(ceil)) {
            this.State = OrderState.Failed;
        }
        else {
            this._v.SetNextCeil(ceil);
        }
    }

    private Init():boolean {
        if (this.State === OrderState.None) 
        {    
            if(this.FindPath())
            {
                this.GoNextCeil();
                this.State = OrderState.Pending;
            }
            else
            {
                this.State = OrderState.Failed;
                return false;
            }
        }
        return true;
    }

    private GetNextCeil():Ceil {
        if(isNullOrUndefined(this.Ceils) || this.Ceils.length === 0)
        {
            return null;
        }

        this.CurrentCeil = this.Ceils[0];
        this.Ceils.splice(0, 1);

        if(this.CurrentCeil.IsBlocked()){
            this.FindPath();
            this.CurrentCeil = this.GetNextCeil();
        }

        return this.CurrentCeil;
    }

    protected FindPath():boolean
    {
        if(this.Dest.IsBlocked())
        {
            this.Dest = this.GetClosestCeil();
            if(isNull(this.Dest))
            {
                return false;
            }
        }
        this.ClearPath();
        this.Ceils = PlaygroundHelper.Engine.GetPath(this._v.GetCurrentCeil(), this.Dest);
        this.CreatePath();
        return true;
    }

    private ClearPath():void
    {
        this._path.forEach(pathItem=>{
            pathItem.Destroy();
        });
        this._path = [];
    }

    private CreatePath():void{
        if(!isNullOrUndefined(this.Ceils) && 0 < this.Ceils.length){
            this.Ceils.forEach(ceil => {
                var pathItem = new BasicItem(
                    ceil.GetBoundingBox(),
                    new Sprite(PlaygroundHelper.Render.Textures['pathCeil']));
                
                    pathItem.Set(this._v.IsSelected.bind(this._v));
                this._path.push(pathItem);
                PlaygroundHelper.Playground.Items.push(pathItem);
            });
        }
    }


    protected GetClosestCeil():Ceil{
        let ceils = this.Dest.GetNeighbourhood().map(c => <Ceil>c);
        if(0 === this.Dest.GetAllNeighbourhood().filter(c=> c === this._v.GetCurrentCeil()).length)
        {
            if(ceils.length === 0)
            {
                return null;
            }
            else
            {
                return this._ceilFinder.GetCeil(ceils, this._v);
            }
        }
        else
        {
            return this._v.GetCurrentCeil();
        }
    }
}