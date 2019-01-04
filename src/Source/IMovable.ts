import { Ceil } from "./Ceil";

export interface IMovable
{
    MoveNextCeil():void;
    GetNextCeil():Ceil;
    TranslationSpeed:number;
}