import { MessageDispatcher } from './Network/MessageDispatcher';
import { CeilsContainer } from "../Ceils/CeilsContainer";
import { Ceil } from "../Ceils/Ceil";
import { AStarEngine } from "../Ia/AStarEngine"; 
import { RenderingHandler } from "./RenderingHandler";
import { GameSettings } from "./GameSettings";
import { AreaEngine } from "../Ia/Area/AreaEngine";
import { ISpriteProvider } from "./ISpriteProvider";
import { Headquarter } from "../Ceils/Field/Headquarter";
import { Area } from "../Ia/Area/Area";
import { Playground } from "../Playground";
import { MapContext } from "../Setup/Generator/MapContext";

export class PlaygroundHelper{
    static MapContext:MapContext;
    static CeilsContainer:CeilsContainer<Ceil>;
    static Engine:AStarEngine<Ceil>;
    static Render:RenderingHandler;
    static Settings:GameSettings=new GameSettings();
    static Playground:Playground;
    private static _areaEngine:AreaEngine<Ceil>;
    static SpriteProvider:ISpriteProvider;
    public static PlayerHeadquarter:Headquarter;
    public static Dispatcher:MessageDispatcher=new MessageDispatcher();

    public static Init():void{
        this._areaEngine = new AreaEngine();
        PlaygroundHelper.CeilsContainer = new CeilsContainer<Ceil>();
        PlaygroundHelper.Engine = new AStarEngine<Ceil>();
        PlaygroundHelper.Settings = new GameSettings();
        PlaygroundHelper.Playground = new Playground();
    }

    public static GetAreas(centerCeil:Ceil):Array<Area>
    {
        return this._areaEngine.GetAreas(PlaygroundHelper.CeilsContainer,centerCeil).map(c=> new Area(c));
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