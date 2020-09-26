import { Player } from './../../Network/Player';
import { GameContext } from './GameContext';
import { NetworkSocket } from './../../Network/NetworkSocket';
import { NetworkContext } from './NetworkContext';
import { RenderingHandler } from '../Setup/Render/RenderingHandler';
import { ItemsUpdater } from '../ItemsUpdater';
import { MapContext } from '../Setup/Generator/MapContext';
import { ViewContext } from '../Utils/Geometry/ViewContext';
import { Dictionnary } from '../Utils/Collections/Dictionnary';
import { TrackingHqValue } from './Tracking/TrackingHqValue';

export class GameHelper {
	public static Updater: ItemsUpdater;
	public static MapContext: MapContext;
	public static NetworkContext: NetworkContext;
	public static Tracking: Dictionnary<TrackingHqValue>;
	public static Socket: NetworkSocket;
	public static Render: RenderingHandler;
	public static ViewContext: ViewContext;
	public static Players: Player[] = [];

	//ugly find another way later
	public static SetNetwork(gameContext: GameContext): void {
		if (this.Socket) {
			this.NetworkContext = new NetworkContext(gameContext, this.Socket);
		}
	}
}
