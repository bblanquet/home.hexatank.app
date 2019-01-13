import { Headquarter } from "../Headquarter";
import { Area } from "./AreaFinder/Area";
import { HqSkin } from "../HqSkin";
import { Ceil } from "../Ceil";
import { HqArea } from "./AreaFinder/HqArea";
import { HqRequest } from "./HqRequest";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Tank } from "../Tank";
import { SimpleOrder } from "./SimpleOrder";
import { Point } from "../Point";
import { SimpleTankOrder } from "./SimpleTankOrder";
import { isNullOrUndefined } from "util";

export class SmartHq extends Headquarter{
    private _conquestedAreas:HqArea[];

    constructor(private _remainingAreas:Area[], skin:HqSkin, ceil:Ceil)
    {
        super(skin,ceil);
        this.Diamonds = 20;
        this._conquestedAreas= new Array<HqArea>();
    }

    public Update(viewX: number, viewY: number, zoom: number):void{
        super.Update(viewX,viewY,zoom);

        let requests = new Array<[HqArea,HqRequest]>();

        this._conquestedAreas.forEach(conquestedArea=>{
            console.log(`%c Q ${conquestedArea.GetCentralCeil().GetCoordinate().Q} R ${conquestedArea.GetCentralCeil().GetCoordinate().R} `,'color:red;font-weight:bold;');
            conquestedArea.Update();
            var request = conquestedArea.GetRequest();
            if(request !== HqRequest.None)
            {
                requests.push([conquestedArea,request]);
            }
        });
        console.log('------------------');

        if(requests.length === 0)
        {   
            console.log(`%c expand `,'color:green;font-weight:bold;');

            var area = this.FindArea();
            area.GetCentralCeil().AddSprite(this.GetSkin().GetColor());
            this._conquestedAreas.push(new HqArea(area));
        }
        else
        {
            var hqArea = requests[0][0];

            console.log(`%c send tank Q ${hqArea.GetCentralCeil().GetCoordinate().Q} R ${hqArea.GetCentralCeil().GetCoordinate().R} ${hqArea.GetTroopsCount()}`,'color:blue;font-weight:bold;');

            this.AddAreaTank(hqArea);
        }
    }

    private AddAreaTank(area:HqArea):boolean
    {
        let isCreated = false;
        this.Fields.some(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                var tank = new Tank(this);
                var ceil = area.SendTank(tank);
                if(!isNullOrUndefined(ceil))
                {
                    tank.SetPosition(field.GetCeil());
                    PlaygroundHelper.Render.Add(tank);
                    PlaygroundHelper.Playground.Items.push(tank);
                    isCreated = true;
                    tank.SetOrder(new SimpleOrder(ceil,tank));
                    return true;
                }
            }
            return false;
        });

        return isCreated;
    }

    private FindArea():Area
    {    
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