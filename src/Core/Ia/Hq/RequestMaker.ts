import { AreaStatus } from "../Area/AreaStatus";
import { RequestPriority } from "./RequestPriority"; 
import { AreaRequest } from "../Area/AreaRequest";

export class RequestMaker{
    public static GetRequest(status:AreaStatus):AreaRequest
    { 
        const enemies = status.GetTotalEnemies();
        if(enemies === 0)
        {
            if(status.InsideTroops === 0)
            {
                console.log(`%c [LOW REQUEST] `,"font-weight:bold;color:green;");
                return new AreaRequest(RequestPriority.Low,1,status);
            }
        }
        else if(status.InsideTroops <= enemies)
        {
            let requestedUnits = status.InsideTroops - status.GetTotalEnemies();

            if(requestedUnits >= 0)
            {
                if(status.InsideEnemies > 0)
                {
                    console.log(`%c [HIGH REQUEST] Enemy Count ${status.GetTotalEnemies()}`,"font-weight:bold;color:red;");
                    return new AreaRequest(RequestPriority.High,requestedUnits+1,status);
                }
    
                let availableSlots = status.Area.GetAvailableCeilCount();
            
                if (requestedUnits > availableSlots) 
                {
                    requestedUnits = availableSlots;
                }
    
                if(status.InsideTroops < status.OutsideEnemies)
                {
                    console.log(`%c [HIGH MEDIUM] Enemy Count ${status.GetTotalEnemies()}`,"font-weight:bold;color:orange;");
                    return new AreaRequest(RequestPriority.Medium,requestedUnits,status);
                }
            }
        }

        return new AreaRequest(RequestPriority.None,0,status);
    }
}