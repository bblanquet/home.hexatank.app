import { HqInfos } from '../Items/Cell/Field/HqInfo';
import { ScaleHandler } from './ScaleHandler';
import { PingHandler } from '../../Components/Network/Ping/PingHandler';
import { MapMode } from '../Setup/Generator/MapMode';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import { InteractionContext } from '../Interaction/InteractionContext';
import { VehiclesContainer } from '../Items/Unit/VehiclesContainer';
import { MessageDispatcher } from '../Utils/Network/MessageDispatcher';
import { CellContainer } from '../Items/Cell/CellContainer';
import { Cell } from '../Items/Cell/Cell';
import { AStarEngine } from '../Ia/AStarEngine';
import { RenderingHandler } from '../Setup/Render/RenderingHandler';
import { GameSettings } from './GameSettings';
import { AreaEngine } from '../Ia/Area/AreaEngine';
import { ISpriteProvider } from './ISpriteProvider';
import { Headquarter } from '../Items/Cell/Field/Headquarter';
import { Area } from '../Ia/Area/Area';
import { ItemsManager } from '../ItemsManager';
import { MapContext } from '../Setup/Generator/MapContext';
import { SpriteProvider } from './SpriteProvider';
import { InputNotifier } from '../Interaction/InputNotifier';
import { Item } from '../Items/Item';
const Viewport = require('pixi-viewport').Viewport;

export class PlaygroundHelper {
	public static IsOnline: boolean = false;
	public static MapContext: MapContext;
	public static PingHandler: PingHandler;
	static CellsContainer: CellContainer<Cell>;
	static VehiclesContainer: VehiclesContainer;
	static Engine: AStarEngine<Cell>;
	static Render: RenderingHandler;
	static Settings: GameSettings = new GameSettings();
	static Playground: ItemsManager;
	private static _areaEngine: AreaEngine<Cell>;
	static SpriteProvider: ISpriteProvider;
	public static PlayerHeadquarter: Headquarter;
	public static Dispatcher: MessageDispatcher = new MessageDispatcher();
	public static PlayerName: string = 'defaultPlayer';
	public static IsFlagingMode: boolean;
	public static ScaleHandler: ScaleHandler;
	public static SetDefaultName() {
		this.PlayerName = 'defaultPlayer';
	}

	public static App: PIXI.Application;
	public static Viewport: any;
	public static InputManager: InputNotifier;
	public static InteractionManager: PIXI.interaction.InteractionManager;
	public static InteractionContext: InteractionContext;

	public static InitApp(): void {
		this.ScaleHandler = new ScaleHandler();
		if (!this.App) {
			this.App = new PIXI.Application({
				backgroundColor: 0x00a651 //0x6d9ae3
			});
			PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
			PIXI.settings.RENDER_OPTIONS.antialias = true;

			this.Viewport = new Viewport({
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

	public static SetAppColor(mapMode: MapMode) {
		this.App.renderer.backgroundColor = mapMode === MapMode.forest ? 0x00a651 : 0xfece63;
	}

	public static WarningChanged: LiteEvent<Boolean> = new LiteEvent<boolean>();
	public static SelectedItem: LiteEvent<Item> = new LiteEvent<Item>();
	public static HqStats: LiteEvent<HqInfos> = new LiteEvent<HqInfos>();

	public static PauseNavigation() {
		this.Viewport.plugins.pause('drag');
		this.Viewport.plugins.pause('pinch');
		this.Viewport.plugins.pause('wheel');
		this.Viewport.plugins.pause('decelerate');
	}

	public static RestartNavigation() {
		this.Viewport.drag().pinch().wheel().decelerate();
	}

	public static HqInfosChanged(hqInfos: HqInfos): void {
		this.HqStats.Invoke(this, hqInfos);
	}

	private static warningObj: any;
	public static SetWarning(): void {
		if (PlaygroundHelper.warningObj) {
			clearTimeout(PlaygroundHelper.warningObj);
		}
		this.WarningChanged.Invoke(this, true);
		PlaygroundHelper.warningObj = setTimeout(() => {
			this.WarningChanged.Invoke(this, false);
		}, 3000);
	}

	public static ResizeTheCanvas(): void {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			this.App.renderer.resize(screen.width, screen.height);
			this.Viewport.screenWidth = screen.width;
			this.Viewport.screenHeight = screen.height;
			this.Viewport.worldWidth = screen.width;
			this.Viewport.worldHeight = screen.height;
			GameSettings.ScreenWidth = screen.width;
			GameSettings.ScreenHeight = screen.height;
		} else {
			this.App.renderer.resize(window.innerWidth, window.innerHeight);
			this.Viewport.screenWidth = window.innerWidth;
			this.Viewport.screenHeight = window.innerHeight;
			this.Viewport.worldWidth = window.innerWidth;
			this.Viewport.worldHeight = window.innerHeight;
			GameSettings.ScreenWidth = window.innerWidth;
			GameSettings.ScreenHeight = window.innerHeight;
		}
	}

	public static Init(): void {
		this._areaEngine = new AreaEngine();
		this.CellsContainer = new CellContainer<Cell>();
		this.VehiclesContainer = new VehiclesContainer();
		this.Engine = new AStarEngine<Cell>();
		this.Settings = new GameSettings();
		this.Playground = new ItemsManager();
		this.InputManager = new InputNotifier();
		this.InteractionContext = new InteractionContext(this.InputManager);
	}

	public static GetAreas(centercell: Cell): Array<Area> {
		return this._areaEngine.GetAreas(PlaygroundHelper.CellsContainer, centercell).map((c) => new Area(c));
	}

	public static GetNeighbourhoodAreas(cell: Cell): Array<Area> {
		return this._areaEngine.GetNeighbourhoodAreas(PlaygroundHelper.CellsContainer, cell).map((c) => new Area(c));
	}

	public static GetSecondRangeAreas(cell: Cell): Array<Cell> {
		return this._areaEngine.GetSecondRangeAreas(PlaygroundHelper.CellsContainer, cell);
	}

	public static GetFirstRangeAreas(cell: Cell): Array<Cell> {
		return this._areaEngine.GetFirstRange(PlaygroundHelper.CellsContainer, cell);
	}

	static InitPingHandler(name: string) {
		if (this.PingHandler) {
			this.PingHandler.Stop();
		}
		this.PingHandler = new PingHandler(name);
	}
}
