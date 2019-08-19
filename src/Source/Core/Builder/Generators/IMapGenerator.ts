import { MapEntity } from "./MapEntity";
 
export interface IMapGenerator{ 
    GetEmptyMap(hqCount:number):MapEntity; 
}