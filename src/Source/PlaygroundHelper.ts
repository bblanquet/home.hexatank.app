import {CeilsContainer} from './CeilsContainer';
import {AStarEngine} from './AStarEngine';
import {Ceil} from './Ceil';
import { RenderingHandler } from './RenderingHandler';
import { GameSettings } from './GameSettings';
import { Playground } from './Playground';
import { LiteEvent } from './LiteEvent';
import { AreaEngine } from './Ia/AreaFinder/AreaEngine';
import { Area } from './Ia/AreaFinder/Area';
import { ISelectable } from './ISelectable';
import { ISpriteProvider } from './Tools/ISpriteProvider';

export class PlaygroundHelper{
    static CeilsContainer:CeilsContainer<Ceil>;
    static Engine:AStarEngine<Ceil>;
    static Render:RenderingHandler;
    static Settings:GameSettings;
    static Playground:Playground;
    static OnSelectedItem:LiteEvent<ISelectable>;
    static OnUnselectedItem:LiteEvent<ISelectable>;
    private static _areaEngine:AreaEngine;
    static SpriteProvider:ISpriteProvider;

    public static Init():void{
        this.OnSelectedItem = new LiteEvent<ISelectable>();
        this.OnUnselectedItem = new LiteEvent<ISelectable>();
        this._areaEngine = new AreaEngine();
        PlaygroundHelper.CeilsContainer = new CeilsContainer<Ceil>();
        PlaygroundHelper.Engine = new AStarEngine<Ceil>();
        PlaygroundHelper.Settings = new GameSettings();
    }

    public static GetAreas(ceil:Ceil):Array<Area>
    {
        return this._areaEngine.GetAreas(PlaygroundHelper.CeilsContainer,ceil).map(c=> new Area(c));
    }


}