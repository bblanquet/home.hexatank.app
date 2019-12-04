import { MapMode } from './../Setup/Generator/MapMode';
import { LiteEvent } from './LiteEvent';
import { InteractionContext } from './../Context/InteractionContext';
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
import { ItemsManager } from "../ItemsManager";
import { MapContext } from "../Setup/Generator/MapContext"; 
import { SpriteProvider } from './SpriteProvider';
import { InputManager } from './InputManager';
import { Item } from '../Items/Item';
const Viewport = require('pixi-viewport').Viewport;

export class PlaygroundHelper{

    static MapContext:MapContext;
    static CeilsContainer:CeilsContainer<Ceil>;
    static VehiclesContainer:VehiclesContainer;
    static Engine:AStarEngine<Ceil>;
    static Render:RenderingHandler;
    static Settings:GameSettings=new GameSettings();
    static Playground:ItemsManager;
    private static _areaEngine:AreaEngine<Ceil>;
    static SpriteProvider:ISpriteProvider;
    public static PlayerHeadquarter:Headquarter;
    public static Dispatcher:MessageDispatcher=new MessageDispatcher();
    public static PlayerName: string="defaultPlayer";
    public static IsFlagingMode: boolean;
    public static SetDefaultName() {
        this.PlayerName = "defaultPlayer";
    }

    public static App: PIXI.Application;
    public static Viewport:any;
    public static InputManager:InputManager;
    public static InteractionManager:PIXI.interaction.InteractionManager;
    public static InteractionContext:InteractionContext;

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
            
            this.InteractionManager = new PIXI.interaction.InteractionManager(this.App.renderer);        
            this.Viewport.drag().pinch().wheel().decelerate();
            this.SpriteProvider = new SpriteProvider();
            this.App.stage.addChild(this.Viewport);
        }
    }

    public static SetAppColor(mapMode:MapMode){
        this.App.renderer.backgroundColor = mapMode === MapMode.forest ? 0x00A651: 0xFECE63;
    }

    public static SelectedItem:LiteEvent<Item> = new LiteEvent<Item>();
    public static selectionCount:number=0;
    public static Select():void{
        this.selectionCount += 1;
    }
    public static Unselect():void{
        this.selectionCount -= 1;
    }
    public static HasSelection():boolean{
        return this.selectionCount > 0;
    }

    public static PauseNavigation() {
        this.Viewport.plugins.pause('drag');
        this.Viewport.plugins.pause('pinch');
        this.Viewport.plugins.pause('wheel');
        this.Viewport.plugins.pause('decelerate');
    }

    public static RestartNavigation() {
        this.Viewport.drag().pinch().wheel().decelerate();
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
        this.selectionCount = 0;
        this._areaEngine = new AreaEngine();
        this.CeilsContainer = new CeilsContainer<Ceil>();
        this.VehiclesContainer = new VehiclesContainer();
        this.Engine = new AStarEngine<Ceil>();
        this.Settings = new GameSettings();
        this.Playground = new ItemsManager();
        this.InputManager = new InputManager();
        this.InteractionContext = new InteractionContext(this.InputManager);
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