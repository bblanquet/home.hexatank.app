import {CeilsContainer} from './CeilsContainer';
import {AStarEngine} from './AStarEngine';
import {Ceil} from './Ceil';
import { RenderingHandler } from './RenderingHandler';
import { GameSettings } from './GameSettings';
import { Vehicle } from './Vehicle';
import { Playground } from './Playground';
import { LiteEvent } from './LiteEvent';

export class PlaygroundHelper{
    static CeilsContainer:CeilsContainer<Ceil>;
    static Engine:AStarEngine<Ceil>;
    static Render:RenderingHandler;
    static Settings:GameSettings;
    private static _vehicles:Array<Vehicle>;
    static Playground:Playground;
    static OnVehiculeSelected:LiteEvent<Vehicle>;
    static OnVehiculeUnSelected:LiteEvent<Vehicle>;


    public static Init():void{
        this.OnVehiculeSelected = new LiteEvent<Vehicle>();
        this.OnVehiculeUnSelected = new LiteEvent<Vehicle>();
        PlaygroundHelper.CeilsContainer = new CeilsContainer<Ceil>();
        PlaygroundHelper.Engine = new AStarEngine<Ceil>();
        PlaygroundHelper.Settings = new GameSettings();
        this._vehicles = new Array<Vehicle>();
    }

    public static Add(vehicle:Vehicle):void{
        this._vehicles.push(vehicle);
    }

    public static Remove(vehicle:Vehicle):void{
        this._vehicles.splice(this._vehicles.indexOf(vehicle),1);
    }

}