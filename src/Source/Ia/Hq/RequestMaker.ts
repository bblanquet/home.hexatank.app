import { AreaStatus } from "../Area/AreaStatus";
import { RequestPriority } from "./RequestPriority"; 
import { AreaRequest } from "../Area/AreaRequest";

export class RequestMaker{
    public static GetRequest(status:AreaStatus):AreaRequest
    { 
        if(status.GetTotalEnemies() === 0)
        {
            if(status.InsideTroops === 0)
            {
                return new AreaRequest(RequestPriority.Low,1,status);
            }
        }
        else if(status.InsideTroops < status.GetTotalEnemies())
        {
            let requiredUnits = status.InsideTroops - status.GetTotalEnemies();
            let availableSlots = status.Area.GetAvailableCeilCount();
        
            if (requiredUnits > availableSlots) 
            {
                requiredUnits = availableSlots;
            }

            if(status.InsideEnemies > 0)
            {
                return new AreaRequest(RequestPriority.High,requiredUnits,status);
            }

            if(status.InsideTroops < status.OutsideEnemies)
            {
                return new AreaRequest(RequestPriority.Medium,requiredUnits,status);
            }
        }

        return new AreaRequest(RequestPriority.None,0,status);
    }
}