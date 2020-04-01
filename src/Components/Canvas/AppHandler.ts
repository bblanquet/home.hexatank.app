import { GameSettings } from './../../Core/Framework/GameSettings';
import { SpriteProvider } from './../../Core/Framework/SpriteProvider';
import { ScaleHandler } from './../../Core/Framework/ScaleHandler';
import { ISpriteProvider } from '../../Core/Framework/ISpriteProvider';
import { MapMode } from '../../Core/Setup/Generator/MapMode';
import { Cell } from '../../Core/Items/Cell/Cell';
import { AStarEngine } from '../../Core/Ia/AStarEngine';
import { ItemsManager } from '../../Core/ItemsManager';
import { InputNotifier } from '../../Core/Interaction/InputNotifier';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
const Viewport = require('pixi-viewport').Viewport;

export class AppHandler {
	public ScaleHandler: ScaleHandler;
	public InputManager: InputNotifier;
	public InteractionContext: InteractionContext;

	private _viewPort: any;
	private _app: PIXI.Application;

	public InteractionManager: PIXI.interaction.InteractionManager;
	private _spriteProvider: ISpriteProvider;
	public Engine: AStarEngine<Cell>;
	public Settings: GameSettings = new GameSettings();
	public Playground: ItemsManager;

	public GetApp(): PIXI.Application {
		return this._app;
	}

	public GetViewport(): any {
		return this._viewPort;
	}

	public GetSpriteProvider(): any {
		return this._spriteProvider;
	}

	public InitApp(): void {
		this.ScaleHandler = new ScaleHandler();
		this._app = new PIXI.Application({
			backgroundColor: 0x00a651 //0x6d9ae3
		});
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
		PIXI.settings.RENDER_OPTIONS.antialias = true;

		this._viewPort = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldWidth: 2000,
			worldHeight: 1000,
			interaction: this._app.renderer.plugins.interaction
		});

		this.InteractionManager = new PIXI.interaction.InteractionManager(this._app.renderer);
		this._viewPort.drag().pinch().wheel().decelerate();
		this._spriteProvider = new SpriteProvider();
		this._app.stage.addChild(this._viewPort);

		this.Engine = new AStarEngine<Cell>();
		this.Settings = new GameSettings();
		this.Playground = new ItemsManager(this.ScaleHandler);
		this.InputManager = new InputNotifier();
	}

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

	public SetBackgroundColor(mapMode: MapMode) {
		this._app.renderer.backgroundColor = mapMode === MapMode.forest ? 0x00a651 : 0xfece63;
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