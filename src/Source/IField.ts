import { Vehicle } from "./Vehicle";

export interface IField{
    Support(vehicule:Vehicle):void;
    IsDesctrutible():boolean;
}