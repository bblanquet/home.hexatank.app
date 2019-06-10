import { HqRequest } from "./HqRequest";
import { HqStatus } from "./HqStatus";
import { HqPriorityRequest } from "./HqPriorityRequest";

export class HqRequestMaker{
    public static GetRequest(status:HqStatus):HqRequest
    {
        if(status.GetTotalEnemies() === 0)
        {
            if(status.InsideTroops === 0)
            {
                return new HqRequest(HqPriorityRequest.Low,1,status);
            }
        }
        else if(status.InsideTroops < status.GetTotalEnemies())
        {
            const diff = status.InsideTroops - status.GetTotalEnemies();
            if(status.InsideEnemies > 0)
            {
                return new HqRequest(HqPriorityRequest.High,diff+1,status);
            }
            if(status.InsideTroops < status.OutsideEnemies)
            {
                return new HqRequest(HqPriorityRequest.Medium,diff,status);
            }
        }

        return new HqRequest(HqPriorityRequest.None,0,status);
    }
}