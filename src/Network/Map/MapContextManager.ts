import { SocketWrapper } from '../Socket/SocketWrapper';
import { GameBlueprintMaker } from './../../Core/Setup/Blueprint/Game/GameBlueprintMaker';
import { MapSetting } from './../../Components/Form/MapSetting';
import { OnlinePlayer } from './../OnlinePlayer';
import { Dictionnary } from './../../Core/Utils/Collections/Dictionnary';
import { INetworkContextService } from './../../Services/NetworkContext/INetworkContextService';
import { IAppService } from './../../Services/App/IAppService';
import { NetworkObserver } from './../NetworkObserver';
import { PacketKind } from './../Message/PacketKind';
import { route } from 'preact-router';
import { GameBlueprint } from '../../Core/Setup/Blueprint/Game/GameBlueprint';
import { MapEnv } from '../../Core/Setup/Blueprint/MapEnv';
import { Singletons, SingletonKey } from '../../Singletons';
import { NetworkMessage } from '../Message/NetworkMessage';
import { GameContext } from '../../Core/Setup/Context/GameContext';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';
import { MapType } from '../../Core/Setup/Blueprint/MapType';
export class MapContextManager {
	private _peerObs: NetworkObserver[];
	private _appService: IAppService<GameBlueprint>;
	private _networkService: INetworkContextService;
	private _gameContextService: IGameContextService<GameBlueprint, GameContext>;

	constructor(
		private _socket: SocketWrapper,
		private _player: OnlinePlayer,
		private _players: Dictionnary<OnlinePlayer>,
		private _mapSetting: MapSetting
	) {
		this._appService = Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App);
		this._networkService = Singletons.Load<INetworkContextService>(SingletonKey.Network);
		this._gameContextService = Singletons.Load<IGameContextService<GameBlueprint, GameContext>>(
			SingletonKey.GameContext
		);

		this._peerObs = [
			//map, loaded, start should be in a service...
			new NetworkObserver(PacketKind.Map, this.HandleMap.bind(this)),
			new NetworkObserver(PacketKind.Loaded, this.HandleLoaded.bind(this)),
			new NetworkObserver(PacketKind.Loading, null),
			new NetworkObserver(PacketKind.Start, this.HandleStart.bind(this))
		];

		// this._peerObs.forEach(obs=>{
		//     _socket.
		// })
	}

	private HandleStart(data: NetworkMessage<any>): void {
		route('/Canvas', true);
	}

	private HandleLoaded(data: NetworkMessage<boolean>): void {
		this._players.Get(data.Emitter).IsLoaded = data.Content;
		if (this._player.IsAdmin && this._players.Values().every((p) => p.IsLoaded)) {
			this._socket.EmitAll<any>(PacketKind.Start, {});
			route('/Canvas', true);
		}
	}

	private HandleMap(data: NetworkMessage<GameBlueprint>): void {
		const mapContext = data.Content;
		mapContext.PlayerName = this._player.Name;
		mapContext.Hqs.forEach((hq) => {
			hq.isIa = false;
		});
		this.Load(mapContext);
	}

	private Loading(): void {
		if (this._players.Values().every((e) => e.IsReady)) {
			this._socket.EmitAll<any>(PacketKind.Loading, {});
			setTimeout(() => {
				let hqCount = +this._mapSetting.IaCount + this._players.Count();
				if (this.ConvertSize() === 8 && 3 < hqCount) {
					this._mapSetting.Size = 'Large';
				} else if (this.ConvertSize() === 8 && 2 < hqCount) {
					this._mapSetting.Size = 'Medium';
				}
				const mapContext = new GameBlueprintMaker().GetBluePrint(
					this.ConvertSize(),
					this.ConvertMapType(),
					this.ConvertEnv(),
					hqCount
				);
				mapContext.PlayerName = this._player.Name;
				this.AssignHqToPlayer(mapContext, this._players.Values());
				this.SetIa(mapContext);
				this.Load(mapContext);
				this._socket.EmitAll<GameBlueprint>(PacketKind.Map, mapContext);
			}, 10);
		}
	}

	private ConvertMapType(): MapType {
		if (this._mapSetting.MapType === 'Flower') return MapType.Flower;
		if (this._mapSetting.MapType === 'Donut') return MapType.Donut;
		if (this._mapSetting.MapType === 'Cheese') return MapType.Cheese;
		if (this._mapSetting.MapType === 'Triangle') return MapType.Triangle;
		if (this._mapSetting.MapType === 'Y') return MapType.Y;
		if (this._mapSetting.MapType === 'H') return MapType.H;
		if (this._mapSetting.MapType === 'X') return MapType.X;
		return MapType.Rectangle;
	}

	private ConvertSize(): number {
		if (this._mapSetting.Size === 'Small') return 8;
		if (this._mapSetting.Size === 'Medium') return 10;
		if (this._mapSetting.Size === 'Large') return 12;
		return 8;
	}

	private ConvertEnv(): MapEnv {
		if (this._mapSetting.Env === 'Sand') return MapEnv.sand;
		if (this._mapSetting.Env === 'Forest') return MapEnv.forest;
		if (this._mapSetting.Env === 'Ice') return MapEnv.ice;
		return MapEnv.forest;
	}

	public SetIa(mapContext: GameBlueprint): void {
		let index = 0;
		mapContext.Hqs.forEach((hq) => {
			if (!hq.PlayerName) {
				hq.isIa = true;
				hq.PlayerName = `IA-${index}`;
			}
			index += 1;
		});
	}

	public AssignHqToPlayer(mapContext: GameBlueprint, players: OnlinePlayer[]): void {
		if (mapContext.Hqs.length < players.length) {
			throw new Error('not enough hq');
		}
		mapContext.Hqs.forEach((hq, index) => {
			if (index < players.length) {
				mapContext.Hqs[index].PlayerName = players[index].Name;
			}
		});
	}

	private Load(mapContext: GameBlueprint) {
		this._appService.Register(mapContext);
		const context = this._gameContextService.Publish();
		this._networkService.Register(this._socket, context, this._players.Values());
		this._player.IsLoaded = true;
		this._socket.EmitAll<boolean>(PacketKind.Loaded, true);
	}
}
