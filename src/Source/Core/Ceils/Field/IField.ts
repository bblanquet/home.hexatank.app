import { Ceil } from "../Ceil"; 
import { Vehicle } from "../../Items/Unit/Vehicle";

export interface IField{
    Support(vehicule:Vehicle):void;
    IsDesctrutible():boolean;
    IsBlocking():boolean;
    GetCeil():Ceil; 
}