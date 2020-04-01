import { LiteEvent } from '../Utils/Events/LiteEvent';
import { RenderingHandler } from '../Setup/Render/RenderingHandler';
import { GameSettings } from './GameSettings';
import { ISpriteProvider } from './ISpriteProvider';
import { Headquarter } from '../Items/Cell/Field/Headquarter';
import { ItemsManager } from '../ItemsManager';
import { MapContext } from '../Setup/Generator/MapContext';
import { Item } from '../Items/Item';

export class GameHelper {
	public static Settings: GameSettings = new GameSettings();
	public static Playground: ItemsManager;
	public static MapContext: MapContext;
	public static Render: RenderingHandler;
	public static SpriteProvider: ISpriteProvider;
	public static PlayerHeadquarter: Headquarter;
	public static PlayerName: string = 'defaultPlayer';
	public static IsFlagingMode: boolean;
	public static ViewPort: any;

	public static SetDefaultName() {
		this.PlayerName = 'defaultPlayer';
	}

	public static SelectedItem: LiteEvent<Item> = new LiteEvent<Item>();
}
