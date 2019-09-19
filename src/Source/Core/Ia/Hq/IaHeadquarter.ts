import { Headquarter } from "../../Ceils/Field/Headquarter";
import { Area } from "../Area/Area";
import { HqSkin } from "../../Utils/HqSkin";
import { Ceil } from "../../Ceils/Ceil";
import { RequestPriority } from "./RequestPriority"; 
import { isNullOrUndefined } from "util";
import { Diamond } from "../../Ceils/Field/Diamond"; 
import { TruckPatrolOrder } from "../Order/TruckPatrolOrder";
import { HqFieldOrder } from "../Order/HqFieldOrder";
import { DiamondFieldOrder } from "../Order/DiamondFieldOrder";
import { Archive } from "../../Utils/ResourceArchiver"; 
import { AreaRequest } from "../Area/AreaRequest";
import { AreaStatus } from "../Area/AreaStatus";
import { RequestMaker } from "./RequestMaker";
import { CenterDecisionMaker } from "./CenterDecisionMaker";
import { Timer } from "../../Utils/Timer";
import { ExpansionMaker } from "./ExpansionMaker";
import { IdleUnitContainer } from "./IdleUnitContainer"; 
import { HeldArea } from "../Area/HeldArea";
import { Truck } from "../../Items/Unit/Truck";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { Explosion } from "../../Items/Unit/Explosion";
import { Tank } from "../../Items/Unit/Tank";
import { PeerHandler } from "../../../Menu/Network/Host/On/PeerHandler";
import { PacketKind } from "../../../Menu/Network/PacketKind";

export class IaHeadquarter extends Headquarter{ 
    public AreasByCeil:{ [id: string] : HeldArea; };
    private _Areas:HeldArea[];
    private _trucks:Array<Truck>;
    private _requestHandler:CenterDecisionMaker;
    public Diamond:Diamond;
    private _timer:Timer;
    private _spreadStrategy:ExpansionMaker;
    public TankBalancer:IdleUnitContainer;

    constructor(public EmptyAreas:Area[], skin:HqSkin, ceil:Ceil)
    {
        super(skin,ceil);
        this._timer = new Timer(10);
        this._trucks = new Array<Truck>();
        this._Areas= new Array<HeldArea>();
        this.AreasByCeil = {};
        this._requestHandler = new CenterDecisionMaker(this);
        this._spreadStrategy = new ExpansionMaker(this);
        this.TankBalancer =new IdleUnitContainer();
    }

    public Update(viewX: number, viewY: number):void{
        super.Update(viewX,viewY);

        this._trucks = this._trucks.filter(t=>t.IsAlive());

        if(this._trucks.length === 0){
            var truck = this.AddTruck();
            
            if(!isNullOrUndefined(truck))
            {
                truck.SetOrder(new TruckPatrolOrder(truck,new HqFieldOrder(this,truck), new DiamondFieldOrder(this.Diamond,truck)));
                this._trucks.push(truck);
            }
        }

        if(this._timer.IsElapsed())
        {
            const statuses = new Array<AreaStatus>();

            this._Areas.forEach(conquestedArea=>
            {
                conquestedArea.HasReceivedRequest = false;
                conquestedArea.Update();
                statuses.push(conquestedArea.GetStatus());
            }); 

            this.TankBalancer.CalculateExcess(statuses);

            const requests: { [id: string] : Array<AreaRequest>; } = {};
            requests[RequestPriority.Low] = new Array<AreaRequest>();
            requests[RequestPriority.Medium] = new Array<AreaRequest>();
            requests[RequestPriority.High] = new Array<AreaRequest>();

            statuses.forEach(status=>{
                let request = RequestMaker.GetRequest(status);
                if(request.Priority != RequestPriority.None)
                {
                    requests[request.Priority].push(request);
                }
            });

            if(this.HasRequests(requests))
            {   
                this._requestHandler.HandleRequests(requests);
            }
            else
            {
                var area = this._spreadStrategy.FindArea();
                if(!isNullOrUndefined(area))
                {
                    if(this.Diamonds >= PlaygroundHelper.Settings.TankPrice)
                    {
                        this.EmptyAreas.splice(this.EmptyAreas.indexOf(area),1);
                        let hqArea =new HeldArea(this,area);
                        this._Areas.push(hqArea);
                        this.AreasByCeil[area.GetCentralCeil().GetCoordinate().ToString()] = hqArea;
                        console.log(`%c GET NEW AREA  ${hqArea.GetArea().GetCentralCeil().GetCoordinate().ToString()}`,"font-weight:bold;color:green;");
                        this.BuyTankForArea(hqArea);
                    }
                }
            }
        }
    }

    private HasRequests(requests: { [id: string]: AreaRequest[]; }) {
        return requests[RequestPriority.Low].length > 0
            || requests[RequestPriority.Medium].length > 0
            || requests[RequestPriority.High].length > 0;
    }

    private AddTruck():Truck
    {
        let truck = null; 
        this.Fields.some(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                this.Diamonds -= PlaygroundHelper.Settings.TruckPrice;
                if(field.GetCeil().IsVisible()){
                    const explosion = new Explosion(field.GetCeil().GetBoundingBox(),Archive.constructionEffects,5,false,5);
                    PlaygroundHelper.Playground.Items.push(explosion);
                }
                this.Count +=1;
                truck = new Truck(this);
                truck.Id = `${this.PlayerName}${this.Count}`;
                truck.SetPosition(field.GetCeil());
                PlaygroundHelper.VehiclesContainer.Add(truck);
                PlaygroundHelper.Playground.Items.push(truck);
                this.NotifyTruck(truck);
                return true;
            }
            return false;
        });

        return truck;
    }

    public BuyTankForArea(area:HeldArea):boolean
    {
        let isCreated = false;
        if(this.Diamonds >= PlaygroundHelper.Settings.TankPrice)
        {
            for(let field of this.Fields)
            {
                if(!field.GetCeil().IsBlocked())
                {
                    var ceil = area.GetAvailableCeil(); 
                    if(!isNullOrUndefined(ceil))
                    {
                        this.Diamonds -= PlaygroundHelper.Settings.TankPrice;
                        if(field.GetCeil().IsVisible())
                        {
                            const explosion = new Explosion(field.GetCeil().GetBoundingBox(),Archive.constructionEffects,5,false,5);
                            PlaygroundHelper.Playground.Items.push(explosion);
                        }
                        this.Count +=1;
                        var tank = new Tank(this);
                        tank.Id = `${this.PlayerName}${this.Count}`;
                        tank.SetPosition(field.GetCeil());
                        area.AddTroop(tank,ceil);
                        PlaygroundHelper.VehiclesContainer.Add(tank);
                        PlaygroundHelper.Playground.Items.push(tank);
                        isCreated = true;
                        this.NotifyTank(tank);
                        return true;
                    }
                }
            }
        }
        return isCreated;
    }
} 