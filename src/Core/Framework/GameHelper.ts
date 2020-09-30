import { RecordData } from './Record/RecordData';
import { Player } from './../../Network/Player';
import { GameContext } from './GameContext';
import { NetworkSocket } from './../../Network/NetworkSocket';
import { NetworkContext } from './NetworkContext';
import { RenderingHandler } from '../Setup/Render/RenderingHandler';
import { ItemsUpdater } from '../ItemsUpdater';
import { MapContext } from '../Setup/Generator/MapContext';
import { ViewContext } from '../Utils/Geometry/ViewContext';

export class GameHelper {
	//use to setup game
	public static MapContext: MapContext;

	//use for items
	public static Render: RenderingHandler;
	public static ViewContext: ViewContext;
	public static Updater: ItemsUpdater;

	public static Record: RecordData;
	public static ComparedRecord: RecordData;

	//use for network
	public static NetworkContext: NetworkContext;
	public static Socket: NetworkSocket;
	public static Players: Player[] = [];

	//ugly find another way later
	public static SetNetwork(gameContext: GameContext): void {
		if (this.Socket) {
			this.NetworkContext = new NetworkContext(gameContext, this.Socket);
		}
	}
}
