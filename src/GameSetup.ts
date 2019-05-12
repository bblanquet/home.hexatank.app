
import { Headquarter } from "./Source/Field/Headquarter";
import { Item } from "./Source/Item";
import { IMapGenerator } from "./Source/Builder/IMapGenerator";
import { MapGenerator } from "./Source/Builder/MapGenerator";
import { Menu } from "./Source/Menu/Menu";
import { PlaygroundHelper } from "./Source/PlaygroundHelper";

export class GameSetup{
    private _mapGenerator:IMapGenerator;
    public SetGame():Item[]
    {
        this._mapGenerator = new MapGenerator();
        const items = this._mapGenerator.SetMap();
        this.SetCenter();
        return items; 
    }

    private SetCenter():void{
        const hqPoint = this._mapGenerator.GetHq().GetBoundingBox().GetCentralPoint();
        const halfWidth = PlaygroundHelper.Settings.GetRelativeWidth()/2;
        const halfHeight = PlaygroundHelper.Settings.GetRelativeHeight()/2;
        PlaygroundHelper.Settings.SetX(-(hqPoint.X - halfWidth));
        PlaygroundHelper.Settings.SetY(-(hqPoint.Y - halfHeight));
    }

    public GetHq():Headquarter{
        return this._mapGenerator.GetHq();
    }

    public GetMenus():Menu[]{
        return this._mapGenerator.GetMenus();
    }
}