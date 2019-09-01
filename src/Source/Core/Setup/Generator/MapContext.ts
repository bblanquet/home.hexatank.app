import { MapItem } from "./MapItem";
import { DiamondHq } from "./DiamondHq";

export class MapContext{ 
    public Items:Array<MapItem>;
    public CenterItem:MapItem;
    public Hqs:Array<DiamondHq>;
    public Hq:DiamondHq;
}