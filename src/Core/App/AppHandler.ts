const Viewport = require('pixi-viewport').Viewport;
import * as PIXI from 'pixi.js';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import { GameContext } from '../Framework/GameContext';
import { ViewContext } from '../Utils/Geometry/ViewContext';
import { GameSettings } from '../Framework/GameSettings';
import { MapEnv } from '../Setup/Generator/MapEnv';
import { ItemsUpdater } from '../ItemsUpdater';
import { InputNotifier } from '../Interaction/InputNotifier';
import { InteractionContext } from '../Interaction/InteractionContext';
import { GameHelper } from '../Framework/GameHelper';
import { RenderingHandler } from '../Setup/Render/RenderingHandler';
import { RenderingGroups } from '../Setup/Render/RenderingGroups';

export abstract class AppHandler {
	//environement
	private _app: PIXI.Application;

	private _viewPort: any;
	public InteractionContext: InteractionContext;
	public InputNotifier: InputNotifier;
	public InteractionManager: PIXI.interaction.InteractionManager;

	public Playground: ItemsUpdater;

	//cannot be extracted?
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();

	public GetApp(): PIXI.Application {
		return this._app;
	}

	public Clear(): void {
		this.InteractionManager.destroy();
		this._app.stop();
		this._app.destroy();
		this._viewPort.destroy();
	}

	public GetViewport(): any {
		return this._viewPort;
	}

	protected SetupApp(): void {
		this._app = new PIXI.Application({});

		this._viewPort = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldWidth: 2000,
			worldHeight: 1000,
			interaction: this._app.renderer.plugins.interaction
		});

		this.InteractionManager = new PIXI.interaction.InteractionManager(this._app.renderer);
		this._viewPort.drag().pinch().wheel().decelerate();
		this._app.stage.addChild(this._viewPort);
		const viewContext = new ViewContext();
		this.Playground = new ItemsUpdater(viewContext);
		this.InputNotifier = new InputNotifier();

		this._viewPort.on('zoomed', (e: any) => {
			if (this._viewPort.scale.x < 0.7) {
				this._viewPort.setZoom(0.7, this._viewPort.center);
				return;
			} else if (this._viewPort.scale.x > 1.5) {
				this._viewPort.setZoom(1.5, this._viewPort.center);
				return;
			}
		});
		GameHelper.Updater = this.Playground;
		GameHelper.ViewContext = viewContext;
		GameHelper.Render = new RenderingHandler(
			new RenderingGroups(
				{
					zs: [ -1, 0, 1, 2, 3, 4, 5 ],
					parent: this.GetViewport()
				},
				{
					zs: [ 6, 7 ],
					parent: this.GetApp().stage
				}
			)
		);
		GameSettings.SetFastSpeed();
		this.GetApp().start();
		this.SetBackgroundColor(GameHelper.MapContext.MapMode);
	}

	public abstract SetupGameContext(): GameContext;

	protected abstract SetupInputs(gameContext: GameContext): void;

	public ResizeTheCanvas(): void {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			this._app.renderer.resize(screen.width, screen.height);
			this._viewPort.screenWidth = screen.width;
			this._viewPort.screenHeight = screen.height;
			this._viewPort.worldWidth = screen.width;
			this._viewPort.worldHeight = screen.height;
			GameSettings.ScreenWidth = screen.width;
			GameSettings.ScreenHeight = screen.height;
		} else {
			this._app.renderer.resize(window.innerWidth, window.innerHeight);
			this._viewPort.screenWidth = window.innerWidth;
			this._viewPort.screenHeight = window.innerHeight;
			this._viewPort.worldWidth = window.innerWidth;
			this._viewPort.worldHeight = window.innerHeight;
			GameSettings.ScreenWidth = window.innerWidth;
			GameSettings.ScreenHeight = window.innerHeight;
		}
	}

	protected SetCenter(gameContext: GameContext): void {
		const hqPoint = gameContext.GetMainHq().GetBoundingBox().GetCentralPoint();
		const halfWidth = GameSettings.ScreenWidth / 2;
		const halfHeight = GameSettings.ScreenHeight / 2;
		this.Playground.ViewContext.SetX(-(hqPoint.X - halfWidth));
		this.Playground.ViewContext.SetY(-(hqPoint.Y - halfHeight));
	}

	private SetBackgroundColor(mapMode: MapEnv) {
		let color = 0x00a651;
		if (mapMode === MapEnv.sand) {
			color = 0xfece63;
		} else if (mapMode === MapEnv.ice) {
			color = 0xacddf3;
		}
		this._app.renderer.backgroundColor = color;
	}

	public PauseNavigation() {
		this._viewPort.plugins.pause('drag');
		this._viewPort.plugins.pause('pinch');
		this._viewPort.plugins.pause('wheel');
		this._viewPort.plugins.pause('decelerate');
	}

	public RestartNavigation() {
		this._viewPort.drag().pinch().wheel().decelerate();
	}
}
