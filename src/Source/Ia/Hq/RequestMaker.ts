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
                console.log(`%c [LOW REQUEST] `,"font-weight:bold;color:green;");
                return new AreaRequest(RequestPriority.Low,1,status);
            }
        }
        else if(status.InsideTroops < status.GetTotalEnemies())
        {
            let requiredUnits = status.InsideTroops - status.GetTotalEnemies();

            if(requiredUnits > 0)
            {
                if(status.InsideEnemies > 0)
                {
                    console.log(`%c [HIGH REQUEST] Enemy Count ${status.GetTotalEnemies()}`,"font-weight:bold;color:red;");
                    return new AreaRequest(RequestPriority.High,requiredUnits,status);
                }
    
                let availableSlots = status.Area.GetAvailableCeilCount();
            
                if (requiredUnits > availableSlots) 
                {
                    requiredUnits = availableSlots;
                }
    
                if(status.InsideTroops < status.OutsideEnemies)
                {
                    console.log(`%c [HIGH MEDIUM] Enemy Count ${status.GetTotalEnemies()}`,"font-weight:bold;color:orange;");
                    return new AreaRequest(RequestPriority.Medium,requiredUnits,status);
                }
            }
        }

        return new AreaRequest(RequestPriority.None,0,status);
    }
}