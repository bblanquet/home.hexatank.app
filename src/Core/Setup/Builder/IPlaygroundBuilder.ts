import { HexAxial } from '../../Utils/Coordinates/HexAxial';  
import { ICell } from '../../Cell/ICell';

export interface IPlaygroundBuilder<T extends ICell>{ 
    Build(n:number) :Array<T>;
    GetMidle(n:number):HexAxial;
    GetAreaMiddlecell(n:number):Array<HexAxial>;  
}