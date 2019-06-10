import {CeilsContainer} from './CeilsContainer'; 
import {AStarEngine} from './AStarEngine';
import {Ceil} from './Ceil';
import { RenderingHandler } from './RenderingHandler';
import { GameSettings } from './GameSettings';
import { Playground } from './Playground';
import { AreaEngine } from './Ia/Area/AreaEngine';
import { Area } from './Ia/Area/Area';
import { ISpriteProvider } from './Tools/ISpriteProvider';
import { Headquarter } from './Field/Headquarter';

export class PlaygroundHelper{
    static CeilsContainer:CeilsContainer<Ceil>;
    static Engine:AStarEngine<Ceil>;
    static Render:RenderingHandler;
    static Settings:GameSettings;
    static Playground:Playground;
    static LoadingPlayground:Playground;
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
}