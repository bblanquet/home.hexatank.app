import { GameContext } from './GameContext';
import { NetworkSocket } from './../../Network/NetworkSocket';
import { NetworkContext } from './NetworkContext';
import { RenderingHandler } from '../Setup/Render/RenderingHandler';
import { ItemsUpdater } from '../ItemsUpdater';
import { MapContext } from '../Setup/Generator/MapContext';
import { ViewContext } from '../Utils/Geometry/ViewContext';

export class GameHelper {
	public static Updater: ItemsUpdater;
	public static MapContext: MapContext;
	public static NetworkContext: NetworkContext;
	public static Socket: NetworkSocket;
	public static Render: RenderingHandler;
	public static ViewContext: ViewContext;

	//ugly find another way later
	public static SetNetwork(gameContext: GameContext) {
		if (this.Socket) {
			this.NetworkContext = new NetworkContext(gameContext, this.Socket);
		}
	}
}
