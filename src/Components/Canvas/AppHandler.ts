import { GameContext } from './../../Core/Framework/GameContext';
import { ViewContext } from './../../Core/Utils/Geometry/ViewContext';
import { GameSettings } from './../../Core/Framework/GameSettings';
import { MapMode } from '../../Core/Setup/Generator/MapMode';
import { ItemsUpdater } from '../../Core/ItemsUpdater';
import { InputNotifier } from '../../Core/Interaction/InputNotifier';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
const Viewport = require('pixi-viewport').Viewport;
import * as PIXI from 'pixi.js';
import { SelectableChecker } from '../../Core/Interaction/SelectableChecker';
import { CombinationProvider } from '../../Core/Interaction/CombinationProvider';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { RenderingHandler } from '../../Core/Setup/Render/RenderingHandler';
import { RenderingGroups } from '../../Core/Setup/Render/RenderingGroups';
import { MapRender } from '../../Core/Setup/Render/MapRender';

export class AppHandler {
	public IsOrderMode: boolean = false;

	//environement
	public InputNotifier: InputNotifier;
	public InteractionContext: InteractionContext;
	private _viewPort: any;
	private _app: PIXI.Application;
	public InteractionManager: PIXI.interaction.InteractionManager;
	public Playground: ItemsUpdater;
	public ViewContext: ViewContext;

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

	public InitApp(): GameContext {
		this._app = new PIXI.Application({
			backgroundColor: 0x00a651 //0x6d9ae3
		});

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
		this.ViewContext = new ViewContext();
		this.Playground = new ItemsUpdater(this.ViewContext);
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
		GameHelper.ViewContext = this.ViewContext;
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
		GameSettings.SetNormalSpeed();
		this.GetApp().start();
		if (!GameHelper.MapContext) {
			throw 'context missing, cannot implement map';
		}

		const gameContext = new MapRender().Render(GameHelper.MapContext);
		GameHelper.SetNetwork(gameContext);
		this.SetupInputs(gameContext);
		return gameContext;
	}

	public SetupInputs(gameContext: GameContext) {
		const checker = new SelectableChecker(gameContext.GetMainHq());
		this.InteractionContext = new InteractionContext(
			this.InputNotifier,
			new CombinationProvider().GetCombination(this, checker, gameContext),
			checker,
			this.GetViewport()
		);
		this.InteractionContext.Listen();
		this.SetBackgroundColor(GameHelper.MapContext.MapMode);

		this.InteractionManager.on('pointerdown', this.InputNotifier.HandleMouseDown.bind(this.InputNotifier), false);
		this.InteractionManager.on('pointermove', this.InputNotifier.HandleMouseMove.bind(this.InputNotifier), false);
		this.InteractionManager.on('pointerup', this.InputNotifier.HandleMouseUp.bind(this.InputNotifier), false);
		this.ResizeTheCanvas();
		window.addEventListener('resize', () => this.ResizeTheCanvas());
		window.addEventListener('DOMContentLoaded', () => this.ResizeTheCanvas());
		this.InteractionManager.autoPreventDefault = false;
		this.SetCenter(gameContext);
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

	public SetCenter(gameContext: GameContext): void {
		const hqPoint = gameContext.GetMainHq().GetBoundingBox().GetCentralPoint();
		const halfWidth = GameSettings.ScreenWidth / 2;
		const halfHeight = GameSettings.ScreenHeight / 2;
		console.log('x: ' + -(hqPoint.X - halfWidth));
		console.log('y: ' + -(hqPoint.Y - halfHeight));
		this.Playground.ViewContext.SetX(-(hqPoint.X - halfWidth));
		this.Playground.ViewContext.SetY(-(hqPoint.Y - halfHeight));
	}

	public SetBackgroundColor(mapMode: MapMode) {
		let color = 0x00a651;
		if (mapMode === MapMode.sand) {
			color = 0xfece63;
		} else if (mapMode === MapMode.ice) {
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
