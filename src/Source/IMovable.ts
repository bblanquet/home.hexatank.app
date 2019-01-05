import { Ceil } from "./Ceil";

export interface IMovable
{
    MoveNextCeil():void;
    GetNextCeil():Ceil;
    SetNextCeil(ceil:Ceil):void;
    GetCurrentCeil():Ceil;
    TranslationSpeed:number;
}