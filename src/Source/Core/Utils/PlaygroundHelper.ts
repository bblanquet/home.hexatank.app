import { VehiclesContainer } from '../Items/Unit/VehiclesContainer';
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
import { SpriteProvider } from './SpriteProvider';
const Viewport = require('pixi-viewport').Viewport;

export class PlaygroundHelper{

    static MapContext:MapContext;
    static CeilsContainer:CeilsContainer<Ceil>;
    static VehiclesContainer:VehiclesContainer;
    static Engine:AStarEngine<Ceil>;
    static Render:RenderingHandler;
    static Settings:GameSettings=new GameSettings();
    static Playground:Playground;
    private static _areaEngine:AreaEngine<Ceil>;
    static SpriteProvider:ISpriteProvider;
    public static PlayerHeadquarter:Headquarter;
    public static Dispatcher:MessageDispatcher=new MessageDispatcher();
    public static PlayerName: string="defaultPlayer";

    private static _isAddingMode:boolean=true;
    private static _isAddingHandlers:{(message:boolean):void}[] = new Array<{(message:boolean):void}>();

    public static IsAddingMode():boolean{
        return this._isAddingMode;
    }

    public static SetAddingMode(mode:boolean):void{
        this._isAddingMode =mode;
        this._isAddingHandlers.forEach(a=>a(this._isAddingMode));
    }
    public static SubscribeAdding(func:{(message:boolean):void}):void{
        this._isAddingHandlers.push(func);
    }
    public static UnSubscribeAdding(func:{(message:boolean):void}):void{
        this._isAddingHandlers = this._isAddingHandlers.filter(f=> f!==func);
    }

    public static SetDefaultName() {
        this.PlayerName = "defaultPlayer";
    }

    public static App: PIXI.Application;
    public static Viewport:any;
    public static Manager:PIXI.interaction.InteractionManager;


    public static InitApp():void{
        if(!this.App){
            this.App = new PIXI.Application({
                backgroundColor: 0x00A651,//0x6d9ae3
              });
              PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
              PIXI.settings.RENDER_OPTIONS.antialias = true;
    
            this.Viewport= new Viewport({
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
                worldWidth: 2000,
                worldHeight: 1000,
                interaction: this.App.renderer.plugins.interaction
              });
            
            this.Manager = new PIXI.interaction.InteractionManager(this.App.renderer);        
            
            this.Viewport.drag().pinch().wheel().decelerate();
            this.SpriteProvider = new SpriteProvider();
            this.SpriteProvider.PreloadTexture();
            this.App.stage.addChild(this.Viewport);
        }
    }

    public static ResizeTheCanvas():void
    {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
        {
            this.App.renderer.resize(screen.width,screen.height); 
            this.Viewport.screenWidth = screen.width;
            this.Viewport.screenHeight = screen.height;
            this.Viewport.worldWidth = screen.width;
            this.Viewport.worldHeight = screen.height;
            this.Settings.ScreenWidth = screen.width;
            this.Settings.ScreenHeight = screen.height;
        }
        else
        {
            this.App.renderer.resize(window.innerWidth,window.innerHeight); 
            this.Viewport.screenWidth = window.innerWidth;
            this.Viewport.screenHeight = window.innerHeight;
            this.Viewport.worldWidth = window.innerWidth;
            this.Viewport.worldHeight = window.innerHeight;
            this.Settings.ScreenWidth = window.innerWidth;
            this.Settings.ScreenHeight = window.innerHeight;
        }
    }

    public static Init():void{
        this._areaEngine = new AreaEngine();
        this.CeilsContainer = new CeilsContainer<Ceil>();
        this.VehiclesContainer = new VehiclesContainer();
        this.Engine = new AStarEngine<Ceil>();
        this.Settings = new GameSettings();
        this.Playground = new Playground();
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