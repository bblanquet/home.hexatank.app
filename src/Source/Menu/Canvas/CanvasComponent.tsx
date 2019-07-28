import * as  PIXI  from 'pixi.js';
import {Component,h} from 'preact';
import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';
import { SpriteProvider } from '../../Core/Utils/SpriteProvider';
import { InteractionContext } from '../../Core/Context/InteractionContext';
import { RenderingHandler } from '../../Core/Utils/RenderingHandler';
import { GroupsContainer } from '../../Core/Utils/GroupsContainer';
import { Item } from '../../Core/Items/Item';
import { Playground } from '../../Core/Playground';
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
  private _interaction:InteractionContext;

  constructor(){
    super();
    this._setup = this.Setup.bind(this);
    this._loop = this.GameLoop.bind(this);
    this._resize = this.ResizeTheCanvas.bind(this);
  }

    /**
   * After mounting, add the Pixi Renderer to the div and start the Application.
   */
  componentDidMount() {
    this._app = new PIXI.Application({
           backgroundColor: 0x00A651,
    });  

    this._viewport= new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1000,
        worldHeight: 1000,
        interaction: this._app.renderer.plugins.interaction
    });

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    PIXI.settings.RENDER_OPTIONS.antialias = true;
    this._app.loader.add(path).load(this._setup);
    this._gameCanvas.appendChild(this._app.view);
    this._app.start();
  }

  /**
   * Stop the Application when unmounting.
   */
  componentWillUnmount() {
    this._app.stop();
  }
  
  /**
   * Simply render the div that will contain the Pixi Renderer.
   */
  render() {
    return (
      <div ref={(thisDiv) => {this._gameCanvas = thisDiv}} />
    );
  }

    Setup():void
    {
        PlaygroundHelper.Init();
        PlaygroundHelper.SpriteProvider = new SpriteProvider(this._app.loader.resources[path].textures);
        this._app.stage.addChild(this._viewport);
        this._viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate();
        PlaygroundHelper.Render = new RenderingHandler(
            new GroupsContainer(
                {
                    zs:[0,1,2,3,4,5],
                    parent:this._viewport
                },
                {
                    zs:[6,7],
                    parent:this._app.stage
                }
                )
            );

        this._interaction = new InteractionContext();
        const items = new Array<Item>();
        
        PlaygroundHelper.Playground = new Playground(items,this._interaction);

        let manager = new PIXI.interaction.InteractionManager(this._app.renderer);
        manager.autoPreventDefault = false;
        manager.on('pointerdown', PlaygroundHelper.Playground.InputManager.OnMouseDown.bind(PlaygroundHelper.Playground.InputManager), false);
        manager.on('pointermove', PlaygroundHelper.Playground.InputManager.OnMouseMove.bind(PlaygroundHelper.Playground.InputManager), false);
        manager.on('pointerup', PlaygroundHelper.Playground.InputManager.OnMouseUp.bind(PlaygroundHelper.Playground.InputManager), false);
        window.addEventListener('resize', this._resize);
        this._resize();
        this._gameSetup = new GameSetup();
        PlaygroundHelper.SpriteProvider.PreloadTexture();
        this._gameSetup.SetGame().forEach(element => {
          PlaygroundHelper.Playground.Items.push(element);        
        });
        this._interaction.SetCombination(this._gameSetup.GetMenus(),this._gameSetup.GetHq());
        this._loop();
    }

    GameLoop():void{
      this.setState({
        refresh:true
      });
      PlaygroundHelper.Playground.Update();
      this._app.renderer.render(this._app.stage);
      requestAnimationFrame(this._loop);
   }

    ResizeTheCanvas():void
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
    }
}