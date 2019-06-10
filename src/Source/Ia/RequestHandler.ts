import { HqPriorityRequest } from "./HqPriorityRequest";
import { HqRequest } from "./HqRequest";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { SmartHq } from "./SmartHq";
import { HqStatus } from "./HqStatus";

export class RequestHandler{

    constructor(private _hq:SmartHq){
        
    }

    public HandleRequests(requests: { [id: string]: HqRequest[]; }, excessAreas:HqStatus[]) 
    {
        if (requests[HqPriorityRequest.High].length > 0) {
            requests[HqPriorityRequest.High].forEach(request => {
                this.HandleHighRequest(request,excessAreas);
            });
        }
        if (requests[HqPriorityRequest.Medium].length > 0) {
            requests[HqPriorityRequest.Medium].forEach(request => {
                this.HandleHighRequest(request,excessAreas);
            });
        }
        if (requests[HqPriorityRequest.Low].length > 0) {
            requests[HqPriorityRequest.Low].forEach(request => {
                this._hq.AddAreaTank(request.Status.Area);
            });
        }
    }

    private HandleHighRequest(request: HqRequest, excessAreas:HqStatus[]) 
    {
        let availableCeilsCount = request.Status.Area.GetAvailableCeilCount();
        
        if (request.RequestedUnitCount > availableCeilsCount) 
        {
            request.RequestedUnitCount = availableCeilsCount;
        }

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