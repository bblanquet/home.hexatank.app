import { RequestPriority } from "../Hq/RequestPriority";
import { AreaStatus } from "./AreaStatus"; 

export class AreaRequest{
    public constructor(
        public Priority:RequestPriority,
        public RequestedUnitCount:number,
        public Status:AreaStatus){
    }
} 