import { PeerHandler } from './../../../Menu/Network/Host/On/PeerHandler';
import { OrderState } from "./OrderState";
import { isNullOrUndefined, isNull } from "util";
import { Order } from "./Order";
import { Ceil } from "../../Ceils/Ceil";
import { CeilFinder } from "../../Ceils/CeilFinder"; 
import { BasicItem } from "../../Items/BasicItem";
import { Timer } from "../../Utils/Timer"; 
import { Vehicle } from "../../Items/Unit/Vehicle";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { Archive } from "../../Utils/ResourceArchiver";
import { PacketKind } from '../../../Menu/Network/PacketKind';

export class SimpleOrder extends Order{
    protected CurrentCeil:Ceil; 
    protected Ceils:Array<Ceil>;
    protected CeilFinder:CeilFinder;
    private _uiPath:Array<BasicItem>;
    protected Dest:Ceil; 
    private _tryCount:number;
    private _sleep:Timer;
    constructor(protected OriginalDest:Ceil,private _v:Vehicle)
    {
        super();
        if(isNullOrUndefined(this.OriginalDest)){
            throw "invalid destination";
        }
        this._sleep = new Timer(100);
        this._tryCount=0;
        this.Dest = OriginalDest;
        this.Ceils = new Array<Ceil>();
        this.CeilFinder = new CeilFinder();
        this._uiPath = [];
    }

    public Cancel(): void {
        super.Cancel();
        this.ClearPath();
    }

    public GetDestination():Ceil{
        return this.Dest;
    }

    public Do(): void 
    {
        if(!this.Init())
        {
            return;
        }

        if(this.CurrentCeil === this._v.GetCurrentCeil())
        {
            if(this._uiPath.length > 0)
            {
                this._uiPath[0].Destroy();
                this._uiPath.splice(0, 1);
            }
            
            if(this.CurrentCeil === this.Dest)
            {
                if(this.Dest === this.OriginalDest)
                {
                    this._tryCount=0;
                    this.State = OrderState.Passed;
                }
                else
                {
                    if(this._sleep.IsElapsed())
                    {
                        if(this._tryCount >= 5)
                        {
                            this.State = OrderState.Failed;
                        }
                        else
                        {
                            this._tryCount += 1;
                            if(isNullOrUndefined(this.OriginalDest.GetOccupier()))
                            {
                                this.Dest = this.OriginalDest;
                            }
                        }
                    }
 
                }
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
        else 
        {
            PeerHandler.SendMessage(PacketKind.Next,{
                Id:this._v.Id,
                NextCeil:ceil.GetCoordinate(),
                Hq:this._v.Hq.GetCeil().GetCoordinate(),
            });
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

        if(this.CurrentCeil.IsBlocked())
        {
            if(this.FindPath())
            {
                this.CurrentCeil = this.GetNextCeil();
            }
            else
            {
                return null;
            }
        }

        return this.CurrentCeil;
    }

    public Reset():void{
        super.Reset();
        this.Dest = this.OriginalDest;
    }

    protected FindPath():boolean
    {
        if(this.Dest.IsBlocked())
        {
            this.Dest = this.GetClosestCeil();
            if(isNullOrUndefined(this.Dest))
            {
                return false;
            }
        }
        this.ClearPath();
        var nextCeils = PlaygroundHelper.Engine.GetPath(this._v.GetCurrentCeil(), this.Dest);
        
        if(isNullOrUndefined(nextCeils))
        {
            return false;
        }
        
        this.Ceils = nextCeils; 
        this.CreateUiPath();
        return true;
    }

    private ClearPath():void
    {
        this._uiPath.forEach(pathItem=>{
            pathItem.Destroy();
        });
        this._uiPath = [];
    }

    private CreateUiPath():void{
        if(!isNullOrUndefined(this.Ceils) && 0 < this.Ceils.length){
            this.Ceils.forEach(ceil => {
                var pathItem = new BasicItem(
                    ceil.GetBoundingBox(),
                    Archive.direction.moving);
                pathItem.SetVisible(this._v.IsSelected.bind(this._v));
                pathItem.SetAlive(this._v.IsAlive.bind(this._v));
                PlaygroundHelper.Playground.Items.push(pathItem);                    
                this._uiPath.push(pathItem);
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
                return this.CeilFinder.GetCeil(ceils, this._v);
            }
        }
        else
        {
            return this._v.GetCurrentCeil();
        }
    }
}