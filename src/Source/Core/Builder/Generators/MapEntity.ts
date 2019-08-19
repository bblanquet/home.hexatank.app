import { Ceil } from './../../Ceils/Ceil';
import { HexAxial } from './../../Utils/Coordinates/HexAxial';
import { Item } from '../../Items/Item';

export class MapEntity{
    Center:HexAxial;
    Areas:HexAxial[];
    Ceils:Ceil[];
    Hqs:HexAxial[];
    items:Item[];
}