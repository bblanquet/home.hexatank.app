// import { MapContext } from './../Setup/Generator/MapContext';
// const Viewport = require('pixi-viewport').Viewport;
// import * as PIXI from 'pixi.js';
// import { LiteEvent } from '../Utils/Events/LiteEvent';
// import { GameContext } from '../Framework/GameContext';
// import { ViewContext } from '../Utils/Geometry/ViewContext';
// import { GameSettings } from '../Framework/GameSettings';
// import { MapEnv } from '../Setup/Generator/MapEnv';
// import { ItemsUpdater } from '../ItemsUpdater';
// import { InputNotifier } from '../Interaction/InputNotifier';
// import { InteractionContext } from '../Interaction/InteractionContext';
// import { GameHelper } from '../Framework/GameHelper';
// import { LayersHandler } from '../Setup/Render/RenderingHandler';
// import { RenderingLayers } from '../Setup/Render/RenderingLayers';

// export abstract class AppHandler {
// 	//environement
// 	private _app: PIXI.Application;
// 	private _itemsUpdater: ItemsUpdater;
// 	private _viewPort: any;
// 	protected InputNotifier: InputNotifier;
// 	protected InteractionManager: PIXI.interaction.InteractionManager;

// 	public InteractionContext: InteractionContext;

// 	//cannot be extracted?
// 	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();

// 	public GetApp(): PIXI.Application {
// 		return this._app;
// 	}

// 	public GetUpdater(): ItemsUpdater {
// 		return this._itemsUpdater;
// 	}

// 	public Clear(): void {
// 		this.InteractionManager.destroy();
// 		this._app.stop();
// 		this._app.destroy();
// 		this._viewPort.destroy();
// 	}

// 	public GetViewport(): any {
// 		return this._viewPort;
// 	}

// 	protected SetupApp(mapContext: MapContext): void {
// 		this._app = new PIXI.Application({});

// 		this._viewPort = new Viewport({
// 			screenWidth: window.innerWidth,
// 			screenHeight: window.innerHeight,
// 			worldWidth: 2000,
// 			worldHeight: 1000,
// 			interaction: this._app.renderer.plugins.interaction
// 		});

// 		this.InteractionManager = new PIXI.interaction.InteractionManager(this._app.renderer);
// 		this._viewPort.drag().pinch().wheel().decelerate();
// 		this._app.stage.addChild(this._viewPort);
// 		const viewContext = new ViewContext();
// 		this._itemsUpdater = new ItemsUpdater(viewContext);
// 		this.InputNotifier = new InputNotifier();

// 		this._viewPort.on('zoomed', (e: any) => {
// 			if (this._viewPort.scale.x < 0.7) {
// 				this._viewPort.setZoom(0.7, this._viewPort.center);
// 				return;
// 			} else if (this._viewPort.scale.x > 1.5) {
// 				this._viewPort.setZoom(1.5, this._viewPort.center);
// 				return;
// 			}
// 		});
// 		GameHelper.Updater = this._itemsUpdater;
// 		GameHelper.ViewContext = viewContext;
// 		GameHelper.Render = new LayersHandler(
// 			new RenderingLayers(
// 				{
// 					zs: [ -1, 0, 1, 2, 3, 4, 5 ],
// 					parent: this.GetViewport()
// 				},
// 				{
// 					zs: [ 6, 7 ],
// 					parent: this.GetApp().stage
// 				}
// 			)
// 		);
// 		GameSettings.SetFastSpeed();
// 		this.GetApp().start();
// 		this.SetBackgroundColor(mapContext);
// 	}

// 	public abstract Generate(mapContext: MapContext): boolean;

// 	protected abstract SetupInputs(gameContext: GameContext): void;

// 	public ResizeTheCanvas(): void {
// 		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
// 			this._app.renderer.resize(screen.width, screen.height);
// 			this._viewPort.screenWidth = screen.width;
// 			this._viewPort.screenHeight = screen.height;
// 			this._viewPort.worldWidth = screen.width;
// 			this._viewPort.worldHeight = screen.height;
// 			GameSettings.ScreenWidth = screen.width;
// 			GameSettings.ScreenHeight = screen.height;
// 		} else {
// 			this._app.renderer.resize(window.innerWidth, window.innerHeight);
// 			this._viewPort.screenWidth = window.innerWidth;
// 			this._viewPort.screenHeight = window.innerHeight;
// 			this._viewPort.worldWidth = window.innerWidth;
// 			this._viewPort.worldHeight = window.innerHeight;
// 			GameSettings.ScreenWidth = window.innerWidth;
// 			GameSettings.ScreenHeight = window.innerHeight;
// 		}
// 	}

// 	protected SetCenter(gameContext: GameContext): void {
// 		const hqPoint = gameContext.GetMainHq().GetBoundingBox().GetCentralPoint();
// 		const halfWidth = GameSettings.ScreenWidth / 2;
// 		const halfHeight = GameSettings.ScreenHeight / 2;
// 		this._itemsUpdater.ViewContext.SetX(-(hqPoint.X - halfWidth));
// 		this._itemsUpdater.ViewContext.SetY(-(hqPoint.Y - halfHeight));
// 	}

// 	private SetBackgroundColor(mapContext: MapContext) {
// 		let color = 0x00a651;
// 		if (mapContext.MapMode === MapEnv.sand) {
// 			color = 0xfece63;
// 		} else if (mapContext.MapMode === MapEnv.ice) {
// 			color = 0xacddf3;
// 		}
// 		this._app.renderer.backgroundColor = color;
// 	}

// 	public PauseNavigation() {
// 		this._viewPort.plugins.pause('drag');
// 		this._viewPort.plugins.pause('pinch');
// 		this._viewPort.plugins.pause('wheel');
// 		this._viewPort.plugins.pause('decelerate');
// 	}

// 	public RestartNavigation() {
// 		this._viewPort.drag().pinch().wheel().decelerate();
// 	}
// }
