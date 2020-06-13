import { SpriteAccuracy } from './../../Core/Framework/SpriteAccuracy';
import { ViewContext } from './../../Core/Utils/Geometry/ViewContext';
import { GameSettings } from './../../Core/Framework/GameSettings';
import { MapMode } from '../../Core/Setup/Generator/MapMode';
import { ItemsUpdater } from '../../Core/ItemsUpdater';
import { InputNotifier } from '../../Core/Interaction/InputNotifier';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
const Viewport = require('pixi-viewport').Viewport;
import * as PIXI from 'pixi.js';
import { Archive } from '../../Core/Framework/ResourceArchiver';

export class AppHandler {
	public IsOrderMode: boolean = false;

	public InputManager: InputNotifier;
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

	public InitApp(): void {
		this._app = new PIXI.Application({
			backgroundColor: 0x00a651 //0x6d9ae3
		});
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
		PIXI.settings.RENDER_OPTIONS.antialias = false;
		PIXI.settings.TARGET_FPMS = PIXI.TARGETS.TEXTURE_2D;

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
		this.InputManager = new InputNotifier();
		// this.Load();

		this._viewPort.on('zoomed', (e: any) => {
			let currentZoom = this._viewPort.scale.x;
			let accuracy = SpriteAccuracy.high;
			if (0.5 < currentZoom && currentZoom < 0.7) {
				accuracy = SpriteAccuracy.mediumHigh;
			} else if (0.3 < currentZoom && currentZoom <= 0.5) {
				accuracy = SpriteAccuracy.medium;
			} else if (currentZoom <= 0.3) {
				accuracy = SpriteAccuracy.low;
			}

			if (this._currentAccuracy !== accuracy) {
				this._currentAccuracy = accuracy;
				this.Playground.UpdateZoom(this._currentAccuracy);
			}
		});
	}

	private _currentAccuracy: SpriteAccuracy = SpriteAccuracy.high;

	private Load(): void {
		this.GetAssets().forEach((asset) => {
			this._app.loader.add(asset, asset);
		});
	}

	public GetAssets(): string[] {
		const keys = new Array<string>();
		this.GetPaths(Archive, keys);
		return keys;
	}

	private GetPaths(value: any, keys: string[]) {
		if (typeof value === 'string') {
			keys.push(this.GetPath(value.slice(1)));
		} else if (value instanceof Array) {
			(value as Array<string>).forEach((filename) => {
				keys.push(this.GetPath(filename.slice(1)));
			});
		} else {
			for (let key in value) {
				this.GetPaths(value[key], keys);
			}
		}
	}

	private GetPath(asset: string): string {
		let path = asset;
		path = path.slice(1); //remove dot
		path = `.{{}}` + path;
		path = path.replace('//', '/');
		return path;
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
