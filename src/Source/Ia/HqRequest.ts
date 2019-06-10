import { HqPriorityRequest } from "./HqPriorityRequest";
import { HqStatus } from "./HqStatus";

export class HqRequest{
    public constructor(
        public Priority:HqPriorityRequest,
        public RequestedUnitCount:number,
        public Status:HqStatus){
    }
}