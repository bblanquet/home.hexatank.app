import {CeilsContainer} from './CeilsContainer';
import {AStarEngine} from './AStarEngine';
import {Ceil} from './Ceil';
import { RenderingHandler } from './RenderingHandler';
import { GameSettings } from './GameSettings';
import { Vehicle } from './Vehicle';
import { Playground } from './Playground';

export class PlaygroundHelper{
    static CeilsContainer:CeilsContainer<Ceil>;
    static Engine:AStarEngine<Ceil>;
    static Render:RenderingHandler;
    static Settings:GameSettings;
    static Vehicles:Array<Vehicle>;
    static Playground:Playground;

    static Init():void{
        PlaygroundHelper.CeilsContainer = new CeilsContainer<Ceil>();
        PlaygroundHelper.Engine = new AStarEngine<Ceil>();
        PlaygroundHelper.Settings = new GameSettings();
    }
}