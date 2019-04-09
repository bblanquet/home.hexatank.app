
import { Headquarter } from "./Source/Field/Headquarter";
import { Item } from "./Source/Item";
import { IMapGenerator } from "./Source/Builder/IMapGenerator";
import { MapGenerator } from "./Source/Builder/MapGenerator";

export class GameSetup{
    private _mapGenerator:IMapGenerator;
    public SetGame():Item[]
    {
        this._mapGenerator = new MapGenerator();
        return this._mapGenerator.SetMap(); 
    }

    public GetHq():Headquarter{
        return this._mapGenerator.GetHq();
    }

}