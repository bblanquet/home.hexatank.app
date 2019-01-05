import { Vehicle } from "./Vehicle";
import { Ceil } from "./Ceil";

export interface IField{
    Support(vehicule:Vehicle):void;
    IsDesctrutible():boolean;
    GetCeil():Ceil;
}