
import { IMapGenerator } from "./Source/Core/Builder/IMapGenerator";
import { MapGenerator } from "./Source/Core/Builder/MapGenerator";
import { Menu } from "./Source/Core/Menu/Menu";
import { PlaygroundHelper } from "./Source/Core/Utils/PlaygroundHelper";
import { Item } from "./Source/Core/Items/Item";
import { Headquarter } from "./Source/Core/Ceils/Field/Headquarter";

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
        const halfWidth = PlaygroundHelper.Settings.ScreenWidth/2;
        const halfHeight = PlaygroundHelper.Settings.ScreenHeight/2;
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