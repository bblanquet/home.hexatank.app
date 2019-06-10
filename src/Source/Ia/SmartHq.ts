import { Headquarter } from "../Field/Headquarter";
import { Area } from "./AreaFinder/Area";
import { HqSkin } from "../HqSkin";
import { Ceil } from "../Ceil";
import { HqArea } from "./AreaFinder/HqArea";
import { HqPriorityRequest } from "./HqPriorityRequest"; 
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Tank } from "../Unit/Tank";
import { isNullOrUndefined } from "util";
import { Truck } from "../Unit/Truck"; 
import { Diamond } from "../Field/Diamond";
import { TruckPatrolOrder } from "./Order/TruckPatrolOrder";
import { HqFieldOrder } from "./Order/HqFieldOrder";
import { DiamondFieldOrder } from "./Order/DiamondFieldOrder";
import { Archive } from "../Tools/ResourceArchiver";
import { Explosion } from "../Unit/Explosion";
import { HqRequest } from "./HqRequest";
import { HqStatus } from "./HqStatus";
import { HqRequestMaker } from "./HqRequestMaker";
import { RequestHandler } from "./RequestHandler";
import { Timer } from "../Tools/Timer";
import { SpreadStrategy } from "./SpreadStrategy";

export class SmartHq extends Headquarter{
    public AreasByCeil:{ [id: string] : HqArea; };
    private _Areas:HqArea[];
    private _trucks:Array<Truck>;
    private _requestHandler:RequestHandler;
    public Diamond:Diamond;
    private _timer:Timer;
    private _spreadStrategy:SpreadStrategy;

    constructor(public EmptyAreas:Area[], skin:HqSkin, ceil:Ceil)
    {
        super(skin,ceil);
        this._timer = new Timer(10);
        this.Diamonds = 20;
        this._trucks = new Array<Truck>();
        this._Areas= new Array<HqArea>();
        this.AreasByCeil = {};
        this._requestHandler = new RequestHandler(this);
        this._spreadStrategy = new SpreadStrategy(this);
    }

    public Update(viewX: number, viewY: number):void{
        super.Update(viewX,viewY);

        this._trucks = this._trucks.filter(t=>t.IsAlive());

        if(this._trucks.length === 0){
            var truck = this.AddTruck();
            
            if(!isNullOrUndefined(truck))
            {
                truck.SetOrder(new TruckPatrolOrder(new HqFieldOrder(this,truck), new DiamondFieldOrder(this.Diamond,truck)));
                this._trucks.push(truck);
            }
        }

        if(this._timer.IsElapsed())
        {
            const statuses = new Array<HqStatus>();

            this._Areas.forEach(conquestedArea=>
            {
                conquestedArea.HasReceivedRequest = false;
                conquestedArea.Update();
                statuses.push(conquestedArea.GetStatus());
            }); 


            const requests: { [id: string] : Array<HqRequest>; } = {};
            requests[HqPriorityRequest.Low] = new Array<HqRequest>();
            requests[HqPriorityRequest.Medium] = new Array<HqRequest>();
            requests[HqPriorityRequest.High] = new Array<HqRequest>();

            statuses.forEach(status=>{
                let request = HqRequestMaker.GetRequest(status);
                if(request.Priority != HqPriorityRequest.None)
                {
                    requests[request.Priority].push(request);
                }
            });

            var excessAreas = statuses.filter(s=>s.GetExcessTroops()>0);

            if(this.HasRequests(requests))
            {   
                this._requestHandler.HandleRequests(requests,excessAreas);
            }
            else
            {
                var area = this._spreadStrategy.FindArea();
                if(!isNullOrUndefined(area))
                {
                    let hqArea =new HqArea(this,area);
                    this._Areas.push(hqArea);
                    this.AreasByCeil[area.GetCentralCeil().GetCoordinate().ToString()] = hqArea;
                }
            }
        }
    }

    private HasRequests(requests: { [id: string]: HqRequest[]; }) {
        return requests[HqPriorityRequest.Low].length > 0
            || requests[HqPriorityRequest.Medium].length > 0
            || requests[HqPriorityRequest.High].length > 0;
    }

    private AddTruck():Truck
    {
        let truck = null; 
        this.Fields.some(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                this.Diamonds -= 3;
                if(field.GetCeil().IsVisible()){
                    const explosion = new Explosion(field.GetCeil().GetBoundingBox(),Archive.constructionEffects,6,false,5);
                    PlaygroundHelper.Playground.Items.push(explosion);
                }
                truck = new Truck(this);
                truck.SetPosition(field.GetCeil());
                PlaygroundHelper.Playground.Items.push(truck);
                return true;
            }
            return false;
        });

        return truck;
    }

    public AddAreaTank(area:HqArea):boolean
    {
        let isCreated = false;
        if(this.Diamonds >= 5)
        {
            for(let field of this.Fields)
            {
                if(!field.GetCeil().IsBlocked())
                {
                    var ceil = area.GetAvailableCeil(); 
                    if(!isNullOrUndefined(ceil))
                    {
                        this.Diamonds -= 5;
                        if(field.GetCeil().IsVisible())
                        {
                            const explosion = new Explosion(field.GetCeil().GetBoundingBox(),Archive.constructionEffects,6,false,5);
                            PlaygroundHelper.Playground.Items.push(explosion);
                        }
                        
                        var tank = new Tank(this);
                        tank.SetPosition(field.GetCeil());
                        area.AddTroop(tank,ceil);
                        PlaygroundHelper.Playground.Items.push(tank);
                        isCreated = true;
                        return true;
                    }
                }
            }
        }
        return isCreated;
    }
} 