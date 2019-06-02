import {ICeil} from '../ICeil';
import { HexAxial } from '../Coordinates/HexAxial';

export interface IPlaygroundBuilder<T extends ICeil>{
    Build(n:number) :Array<T>;
    GetMidle(n:number):HexAxial;
    GetAreaMiddleCeil(n:number):Array<HexAxial>;  
}