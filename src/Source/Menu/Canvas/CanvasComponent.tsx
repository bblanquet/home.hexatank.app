import * as  PIXI  from 'pixi.js';
import {Component,h} from 'preact';
import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';
import { SpriteProvider } from '../../Core/Utils/SpriteProvider';
import { GameSetup } from '../../Core/GameSetup';
const Viewport = require('pixi-viewport').Viewport;
const path = "./Program6.json";

export default class CanvasComponent extends Component<any, {refresh:boolean}> {
  private _app: PIXI.Application;
  private _gameCanvas: HTMLDivElement;
  private _viewport:any;
  private _setup:{():void};
  private _loop:{():void};
  private _resize:{():void};
  private _gameSetup:GameSetup;
  private _isFirstResize:boolean=true;

  constructor(){
    super();
    this._setup = this.Setup.bind(this);
    this._loop = this.GameLoop.bind(this);
    this._resize = this.ResizeTheCanvas.bind(this);
  }

  componentDidMount() {
    this._app = new PIXI.Application({
           backgroundColor: 0x6d9ae3//0x00A651,
    });  

    this._viewport= new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 2000,
        worldHeight: 1000,
        interaction: this._app.renderer.plugins.interaction
    });

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    PIXI.settings.RENDER_OPTIONS.antialias = true;
    this._app.loader.add(path).load(this._setup);
    this._gameCanvas.appendChild(this._app.view);
    this._app.start();
  }

  componentWillUnmount() {
    this._app.stop();
  }
  
  render() {
    return (
      <div ref={(dom) => {this._gameCanvas = dom}} />
    );
  }

  private Setup():void
    {
        let manager = new PIXI.interaction.InteractionManager(this._app.renderer);
        PlaygroundHelper.SpriteProvider = new SpriteProvider(this._app.loader.resources[path].textures);
        this._app.stage.addChild(this._viewport);
        this._viewport.drag().pinch().wheel().decelerate();
        this._gameSetup = new GameSetup();
        this._gameSetup.SetGame(this._app.stage,this._viewport);
        manager.autoPreventDefault = false;
        manager.on('pointerdown', PlaygroundHelper.Playground.InputManager.OnMouseDown.bind(PlaygroundHelper.Playground.InputManager), false);
        manager.on('pointermove', PlaygroundHelper.Playground.InputManager.OnMouseMove.bind(PlaygroundHelper.Playground.InputManager), false);
        manager.on('pointerup', PlaygroundHelper.Playground.InputManager.OnMouseUp.bind(PlaygroundHelper.Playground.InputManager), false);
        window.addEventListener('resize', this._resize);
        window.addEventListener('DOMContentLoaded',this._resize);
        this._resize();
        this._loop();
    }

    private GameLoop():void{
      this.setState({
        refresh:true
      });
      PlaygroundHelper.Playground.Update();
      this._app.renderer.render(this._app.stage);
      requestAnimationFrame(this._loop);
   }

    private ResizeTheCanvas():void
    {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
        {
            this._app.renderer.resize(screen.width,screen.height); 
            this._viewport.screenWidth = screen.width;
            this._viewport.screenHeight = screen.height;
            this._viewport.worldWidth = screen.width;
            this._viewport.worldHeight = screen.height;
            PlaygroundHelper.Settings.ScreenWidth = screen.width;
            PlaygroundHelper.Settings.ScreenHeight = screen.height;
        }
        else
        {
            this._app.renderer.resize(window.innerWidth,window.innerHeight); 
            this._viewport.screenWidth = window.innerWidth;
            this._viewport.screenHeight = window.innerHeight;
            this._viewport.worldWidth = window.innerWidth;
            this._viewport.worldHeight = window.innerHeight;
            PlaygroundHelper.Settings.ScreenWidth = window.innerWidth;
            PlaygroundHelper.Settings.ScreenHeight = window.innerHeight;
        }

        if(this._isFirstResize){
          this._isFirstResize = false;
          this._gameSetup.SetCenter();
        }
    }
}