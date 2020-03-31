import { HqInfos } from '../Items/Cell/Field/HqInfo';
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
import { InputNotifier } from '../Interaction/InputNotifier';
import { Item } from '../Items/Item';

export class GameHelper {
	public static AreaEngine: AreaEngine<Cell>;
	public static Cells: CellContainer<Cell>;
	public static VehiclesContainer: VehiclesContainer;
	public static Engine: AStarEngine<Cell>;
	public static Settings: GameSettings = new GameSettings();
	public static Playground: ItemsManager;
	public static InputManager: InputNotifier;

	public static MapContext: MapContext;

	public static Render: RenderingHandler;
	public static SpriteProvider: ISpriteProvider;
	public static PlayerHeadquarter: Headquarter;
	public static Dispatcher: MessageDispatcher = new MessageDispatcher();
	public static PlayerName: string = 'defaultPlayer';
	public static IsFlagingMode: boolean;
	public static ViewPort: any;

	public static SetDefaultName() {
		this.PlayerName = 'defaultPlayer';
	}

	public static InteractionManager: PIXI.interaction.InteractionManager;
	public static InteractionContext: InteractionContext;

	public static WarningChanged: LiteEvent<Boolean> = new LiteEvent<boolean>();
	public static SelectedItem: LiteEvent<Item> = new LiteEvent<Item>();
	public static HqStats: LiteEvent<HqInfos> = new LiteEvent<HqInfos>();

	public static HqInfosChanged(hqInfos: HqInfos): void {
		this.HqStats.Invoke(this, hqInfos);
	}

	private static warningObj: any;
	public static SetWarning(): void {
		if (GameHelper.warningObj) {
			clearTimeout(GameHelper.warningObj);
		}
		this.WarningChanged.Invoke(this, true);
		GameHelper.warningObj = setTimeout(() => {
			this.WarningChanged.Invoke(this, false);
		}, 3000);
	}

	public static GetAreas(centercell: Cell): Array<Area> {
		return this.AreaEngine.GetAreas(GameHelper.Cells, centercell).map((c) => new Area(c));
	}

	public static GetNeighbourhoodAreas(cell: Cell): Array<Area> {
		return this.AreaEngine.GetAroundAreas(GameHelper.Cells, cell).map((c) => new Area(c));
	}
}
