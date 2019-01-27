import { Headquarter } from "../Field/Headquarter";
import { Area } from "./AreaFinder/Area";
import { HqSkin } from "../HqSkin";
import { Ceil } from "../Ceil";
import { HqArea } from "./AreaFinder/HqArea";
import { HqRequest } from "./HqRequest";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Tank } from "../Tank";
import { Point } from "../Point";
import { isNullOrUndefined } from "util";
import { Truck } from "../Truck";
import { Diamond } from "../Field/Diamond";
import { TruckPatrolOrder } from "./TruckPatrolOrder";
import { HqFieldOrder } from "./HqFieldOrder";
import { DiamondFieldOrder } from "./DiamondFieldOrder";

export class SmartHq extends Headquarter{
    private _conquestedAreas:HqArea[];
    private _trucks:Array<Truck>;
    public Diamond:Diamond;

    constructor(private _remainingAreas:Area[], skin:HqSkin, ceil:Ceil)
    {
        super(skin,ceil);
        this.Diamonds = 20;
        this._trucks = new Array<Truck>();
        this._conquestedAreas= new Array<HqArea>();
    }

    public Update(viewX: number, viewY: number, zoom: number):void{
        super.Update(viewX,viewY,zoom);

        let requests = new Array<[HqArea,HqRequest]>();
        
        this._trucks = this._trucks.filter(t=>t.IsAlive());

        if(this._trucks.length === 0){
            var truck = this.AddTruck();
            
            if(!isNullOrUndefined(truck))
            {
                truck.SetOrder(new TruckPatrolOrder(new HqFieldOrder(this,truck), new DiamondFieldOrder(this.Diamond,truck)));
                this._trucks.push(truck);
            }
        }

        this._conquestedAreas.forEach(conquestedArea=>
        {
            conquestedArea.Update();
            var request = conquestedArea.GetRequest();
            if(request !== HqRequest.None)
            {
                requests.push([conquestedArea,request]);
            }
        }); 

        if(requests.length === 0)
        {   
            var area = this.FindArea();
            if(!isNullOrUndefined(area))
            {
                area.GetCentralCeil().AddSprite(this.GetSkin().GetColor());
                this._conquestedAreas.push(new HqArea(area));
            }
        }
        else
        {
            var hqArea = requests[0][0];
            this.AddAreaTank(hqArea);
        }
    }

    private AddTruck():Truck
    {
        let truck = null; 
        this.Fields.some(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                this.Diamonds -= 3;
                truck = new Truck(this);
                truck.SetPosition(field.GetCeil());
                PlaygroundHelper.Render.Add(truck);
                PlaygroundHelper.Playground.Items.push(truck);
                return true;
            }
            return false;
        });

        return truck;
    }

    private AddAreaTank(area:HqArea):boolean
    {
        let isCreated = false;
        this.Fields.some(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                var ceil =area.GetAvailableCeil(); 
                if(!isNullOrUndefined(ceil) && this.Diamonds >= 5)
                {
                    this.Diamonds -= 5;
                    var tank = new Tank(this);
                    tank.SetPosition(field.GetCeil());
                    area.AddTroop(tank,ceil);
                    PlaygroundHelper.Playground.Items.push(tank);
                    isCreated = true;
                    return true;
                }
            }
            return false;
        });

        return isCreated;
    }

    private FindArea():Area
    {    
        if(this._remainingAreas.length === 0)
        {
            return null;
        }

        let currentArea = this._remainingAreas[0];
        let currentCost = this.GetCost(
            this.GetCeil().GetCentralPoint(),
            currentArea.GetCentralCeil().GetCentralPoint()
        );

        this._remainingAreas.forEach(area => 
        {
            let cost = this.GetCost(
                this.GetCeil().GetCentralPoint(),
                area.GetCentralCeil().GetCentralPoint()
            )
               if(cost < currentCost)
               {
                    currentArea = area;
                    currentCost = cost;
               }
        });

        this._remainingAreas.splice(this._remainingAreas.indexOf(currentArea),1);
        return currentArea;
    }

    private GetCost(a:Point,b:Point):number
    {
        return Math.sqrt(Math.pow(b.X - a.X,2)) 
            + Math.sqrt(Math.pow(b.Y - a.Y,2));
    }
} 