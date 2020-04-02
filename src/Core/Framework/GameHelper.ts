import { RenderingHandler } from '../Setup/Render/RenderingHandler';
import { ItemsUpdater } from '../ItemsUpdater';
import { MapContext } from '../Setup/Generator/MapContext';

export class GameHelper {
	public static Updater: ItemsUpdater;
	public static MapContext: MapContext;
	public static Render: RenderingHandler;
}
