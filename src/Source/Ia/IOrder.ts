import { OrderState } from "./OrderState";

export interface IOrder{
    IsDone():boolean;
    GetState():OrderState;
    Do():void;
    Cancel():void;
} 