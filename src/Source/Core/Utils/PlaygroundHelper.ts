import { CeilsContainer } from "../Ceils/CeilsContainer";
import { Ceil } from "../Ceils/Ceil";
import { AStarEngine } from "../Ia/AStarEngine"; 
import { RenderingHandler } from "./RenderingHandler";
import { GameSettings } from "./GameSettings";
import { Playground } from "../Playground";
import { AreaEngine } from "../Ia/Area/AreaEngine";
import { ISpriteProvider } from "./ISpriteProvider";
import { Headquarter } from "../Ceils/Field/Headquarter";
import { Area } from "../Ia/Area/Area";

export class PlaygroundHelper{
    static CeilsContainer:CeilsContainer<Ceil>;
    static Engine:AStarEngine<Ceil>;
    static Render:RenderingHandler;
    static Settings:GameSettings;
    static CorePlayground:Playground;
    static MenuPlayground:Playground;
    static CurrentPlayground:Playground;
    private static _areaEngine:AreaEngine;
    static SpriteProvider:ISpriteProvider;
    public static PlayerHeadquarter:Headquarter;

    public static Init():void{
        this._areaEngine = new AreaEngine();
        PlaygroundHelper.CeilsContainer = new CeilsContainer<Ceil>();
        PlaygroundHelper.Engine = new AStarEngine<Ceil>();
        PlaygroundHelper.Settings = new GameSettings();
    }

    public static GetAreas(ceil:Ceil):Array<Area>
    {
        return this._areaEngine.GetAreas(PlaygroundHelper.CeilsContainer,ceil).map(c=> new Area(c));
    }

    public static GetNeighbourhoodAreas(ceil:Ceil):Array<Area>{
        return this._areaEngine.GetNeighbourhoodAreas(PlaygroundHelper.CeilsContainer,ceil).map(c=> new Area(c));
    }

    public static GetSecondRangeAreas(ceil:Ceil):Array<Ceil>{
        return this._areaEngine.GetSecondRangeAreas(PlaygroundHelper.CeilsContainer,ceil);
    }

    public static GetFirstRangeAreas(ceil:Ceil):Array<Ceil>{
        return this._areaEngine.GetFirstRange(PlaygroundHelper.CeilsContainer,ceil);
    }
}