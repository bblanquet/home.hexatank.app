import { Vehicle } from "../Vehicle";
import { Ceil } from "../Ceil";

export interface IField{
    Support(vehicule:Vehicle):void;
    IsDesctrutible():boolean;
    IsBlocking():boolean;
    GetCeil():Ceil;
}