import { HqPriorityRequest } from "./HqPriorityRequest";
import { HqRequest } from "./HqRequest";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { SmartHq } from "./SmartHq";

export class RequestHandler{

    constructor(private _hq:SmartHq){
        
    }

    public HandleRequests(requests: { [id: string]: HqRequest[]; }) 
    {
        if (requests[HqPriorityRequest.High].length > 0) {
            requests[HqPriorityRequest.High].forEach(request => {
                this.HandleHighRequest(request);
            });
        }
        if (requests[HqPriorityRequest.Medium].length > 0) {
            requests[HqPriorityRequest.Medium].forEach(request => {
                this.HandleMediumRequest(request);
            });
        }
        if (requests[HqPriorityRequest.Low].length > 0) {
            requests[HqPriorityRequest.Low].forEach(request => {
                this._hq.BuyTankForArea(request.Status.Area);
            });
        }
    }

    private HandleHighRequest(request: HqRequest) 
    {
        let availableCeilsCount = request.Status.Area.GetAvailableCeilCount();
        
        if (request.RequestedUnitCount > availableCeilsCount) 
        {
            request.RequestedUnitCount = availableCeilsCount;
        }

        this.GetHelpFromSurrounding(request);
    }

    private HandleMediumRequest(request: HqRequest) 
    {
        let availableCeilsCount = request.Status.Area.GetAvailableCeilCount();
        
        if (request.RequestedUnitCount > availableCeilsCount) 
        {
            request.RequestedUnitCount = availableCeilsCount;
        }

        if(this._hq.TankBalancer.HasTank())
        {
            this.GetHelpFromExcess(request);
        }
        else
        {
            this.GetHelpFromBuying(request);
        }
    }

    private GetHelpFromBuying(request: HqRequest){
        while(request.RequestedUnitCount > 0){
            const isPassed = this._hq.BuyTankForArea(request.Status.Area);
            if(isPassed){
                request.RequestedUnitCount -=1;
            }
            else
            {
                return;
            }
        }
    }


    private GetHelpFromExcess(request: HqRequest){
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

    private GetHelpFromSurrounding(request: HqRequest){
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