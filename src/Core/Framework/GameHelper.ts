import { RenderingHandler } from '../Setup/Render/RenderingHandler';
import { ItemsManager } from '../ItemsManager';
import { MapContext } from '../Setup/Generator/MapContext';

export class GameHelper {
	public static Playground: ItemsManager;
	public static MapContext: MapContext;
	public static Render: RenderingHandler;
	public static IsFlagingMode: boolean;
}
