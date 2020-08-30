import { NetworkContext } from './NetworkContext';
import { RenderingHandler } from '../Setup/Render/RenderingHandler';
import { ItemsUpdater } from '../ItemsUpdater';
import { MapContext } from '../Setup/Generator/MapContext';
import { ViewContext } from '../Utils/Geometry/ViewContext';

export class GameHelper {
	public static Updater: ItemsUpdater;
	public static MapContext: MapContext;
	public static NetworkContext: NetworkContext;
	public static Render: RenderingHandler;
	public static ViewContext: ViewContext;
}
