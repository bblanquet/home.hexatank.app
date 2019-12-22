import { HexAxial } from '../../Utils/Coordinates/HexAxial';  
import { ICeil } from '../../Ceils/ICeil';

export interface IPlaygroundBuilder<T extends ICeil>{ 
    Build(n:number) :Array<T>;
    GetMidle(n:number):HexAxial;
    GetAreaMiddleCeil(n:number):Array<HexAxial>;  
}