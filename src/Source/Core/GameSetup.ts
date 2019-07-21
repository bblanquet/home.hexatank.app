
import { IMapGenerator } from "./Builder/IMapGenerator";
import { MapGenerator } from "./Builder/MapGenerator";
import { Menu } from "./Menu/Menu";
import { PlaygroundHelper } from "./Utils/PlaygroundHelper";
import { Item } from "./Items/Item";
import { Headquarter } from "./Ceils/Field/Headquarter";

export class GameSetup{
    private _mapGenerator:IMapGenerator;
    public SetGame():Item[]
    { 
        this._mapGenerator = new MapGenerator();
        const items = this._mapGenerator.SetMap();
        //this.SetCenter();
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