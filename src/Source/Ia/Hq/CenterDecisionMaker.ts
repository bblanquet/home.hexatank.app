import { RequestPriority } from "./RequestPriority";
import { IaHeadquarter } from "./IaHeadquarter";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { AreaRequest } from "../Area/AreaRequest";

export class CenterDecisionMaker{

    constructor(private _hq:IaHeadquarter){
    }

    public HandleRequests(requests: { [id: string]: AreaRequest[]; }) 
    {
        if (requests[RequestPriority.High].length > 0) {
            requests[RequestPriority.High].forEach(request => {
                this.GetHelpFromSurrounding(request); 
            });
        }
        if (requests[RequestPriority.Medium].length > 0) {
            requests[RequestPriority.Medium].forEach(request => {
                this.HandleMediumRequest(request);
            });
        }
        if (requests[RequestPriority.Low].length > 0) {
            requests[RequestPriority.Low].forEach(request => {
                this.HandleMediumRequest(request);
            });
        }
    }


    private HandleMediumRequest(request: AreaRequest) 
    {
        if(this._hq.TankBalancer.HasTank())
        {
            this.GetHelpFromExcess(request);
        }

        if(request.RequestedUnitCount > 0)
        {
            this.GetHelpFromBuying(request);
        }
    }

    private GetHelpFromBuying(request: AreaRequest){
        while(request.RequestedUnitCount > 0){
            const isPassed = this._hq.BuyTankForArea(request.Status.Area);
            if(isPassed)
            {
                request.RequestedUnitCount -=1;
            }
            else
            {
                return;
            }
        }
    }


    private GetHelpFromExcess(request: AreaRequest){
        while(this._hq.TankBalancer.HasTank() 
            && request.RequestedUnitCount > 0)
        {
            const ceil = request.Status.Area.GetAvailableCeil();

            if(ceil)
            {
                request.Status.Area.AddTroop(this._hq.TankBalancer.Pop(),ceil);
                request.RequestedUnitCount -= 1;
            }
            else
            {
                return;
            }
        }
    }

    private GetHelpFromSurrounding(request: AreaRequest)
    {
        var aroundAreas = PlaygroundHelper.GetNeighbourhoodAreas(request.Status.Area.GetCentralCeil());
        
        for (const aroundArea of aroundAreas) 
        {
            const key = aroundArea.GetCentralCeil().GetCoordinate().ToString();
            if (this._hq.AreasByCeil.hasOwnProperty(key)) 
            {
                const hqAroundArea = this._hq.AreasByCeil[key];
                if(!hqAroundArea.HasReceivedRequest)
                {
                    while (hqAroundArea.HasTroop()) 
                    {
                        if(request.RequestedUnitCount === 0)
                        {
                            return;
                        }
                        const ceil = request.Status.Area.GetAvailableCeil();

                        if(ceil)
                        {
                            const tank = hqAroundArea.DropTroop();
                            request.Status.Area.AddTroop(tank,ceil);
                            request.RequestedUnitCount -= 1;
                        }
                        else
                        {
                            return;
                        }
                    }
                    hqAroundArea.HasReceivedRequest = true;
                }
            }
        }
    }
}