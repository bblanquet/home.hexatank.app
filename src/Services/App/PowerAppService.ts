import { PowerAudioManager } from '../../Core/Framework/Audio/PowerAudioManager';
import { PowerContext } from './../../Core/Setup/Context/PowerContext';
import { PowerBlueprint } from './../../Core/Setup/Blueprint/Power/PowerBlueprint';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { StatsContext } from '../../Core/Framework/Stats/StatsContext';
import { IInteractionService } from '../Interaction/IInteractionService';
import { INetworkContextService } from '../Network/INetworkContextService';
import { ILayerService } from '../Layer/ILayerService';
import { IUpdateService } from '../Update/IUpdateService';
import { IGameContextService } from '../GameContext/IGameContextService';
import { AppProvider } from '../../Core/App/AppProvider';
import { IAppService } from './IAppService';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { IKeyService } from '../Key/IKeyService';
import { CellStateSetter } from '../../Core/Items/Cell/CellStateSetter';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { IAudioService } from '../Audio/IAudioService';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { GameStatus } from '../../Core/Framework/GameStatus';

export class PowerAppService implements IAppService<PowerBlueprint> {
	private _blueprint: PowerBlueprint;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _interactionManager: PIXI.InteractionManager;
	private _gameAudioService: PowerAudioManager;

	private _gameContextService: IGameContextService<PowerBlueprint, PowerContext>;
	private _interactionService: IInteractionService<PowerContext>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _networkService: INetworkContextService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;

	constructor() {
		this._appProvider = new AppProvider();
		this._gameContextService = Singletons.Load<IGameContextService<PowerBlueprint, PowerContext>>(
			SingletonKey.PowerGameContext
		);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._networkService = Singletons.Load<INetworkContextService>(SingletonKey.Network);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._interactionService = Singletons.Load<IInteractionService<PowerContext>>(SingletonKey.PowerInteraction);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._audioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
	}

	public Register(blueprint: PowerBlueprint): void {
		this._keyService.DefineKey(this);

		GameSettings.Init();
		GameSettings.SetNormalSpeed();
		this._blueprint = blueprint;
		this._updateService.Register();
		this._app = this._appProvider.Provide(blueprint);
		this._interactionManager = new PIXI.InteractionManager(this._app.renderer);

		this._layerService.Register(this._app);
		this._gameContextService.Register(blueprint);
		const gameContext = this._gameContextService.Publish();
		this._interactionService.Register(this._interactionManager, gameContext);
		this._gameAudioService = new PowerAudioManager(blueprint, gameContext);
		this._audioService.Register(this._gameAudioService);
		gameContext.OnGameStatusChanged.On(this.GameStatusChanged.bind(this));

		gameContext.GetCells().forEach((c) => {
			c.AlwaysVisible();
		});

		CellStateSetter.SetStates(gameContext.GetCells());
		this._app.start();
	}

	private GameStatusChanged(e: any, status: GameStatus) {
		if (status === GameStatus.Defeat) {
			this._audioService.Play(AudioArchive.defeat, 0.5, false);
		}

		if (status === GameStatus.Victory) {
			this._audioService.Play(AudioArchive.victory, 0.5, false);
		}
	}

	GetStats(): StatsContext {
		return null;
	}
	GetRecord(): RecordContext {
		return null;
	}

	public Publish(): PIXI.Application {
		return this._app;
	}

	public Context(): PowerBlueprint {
		return this._blueprint;
	}

	public Collect(): void {
		this._gameAudioService.StopAll();
		this._audioService.Collect();
		this._interactionManager.destroy();
		this._gameContextService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._networkService.Collect();
		this._app.destroy();
		this._app = null;
		this._audioService.Reload();
	}
}
