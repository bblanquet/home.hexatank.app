import { CamouflageAudioManager } from '../../Core/Framework/Audio/CamouflageAudioManager';
import { CamouflageBlueprint } from '../../Core/Setup/Blueprint/Cam/CamouflageBlueprint';
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
import { CamouflageContext } from '../../Core/Setup/Context/CamouflageContext';
import { IAudioService } from '../Audio/IAudioService';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { GameStatus } from '../../Core/Framework/GameStatus';

export class CamouflageAppService implements IAppService<CamouflageBlueprint> {
	private _blueprint: CamouflageBlueprint;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _interactionManager: PIXI.InteractionManager;

	private _gameContextService: IGameContextService<CamouflageBlueprint, CamouflageContext>;
	private _interactionService: IInteractionService<CamouflageContext>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _networkService: INetworkContextService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;
	private _gameAudioService: CamouflageAudioManager;

	constructor() {
		this._appProvider = new AppProvider();
		this._gameContextService = Singletons.Load<IGameContextService<CamouflageBlueprint, CamouflageContext>>(
			SingletonKey.CamouflageGameContext
		);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._networkService = Singletons.Load<INetworkContextService>(SingletonKey.Network);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._audioService = Singletons.Load<IAudioService>(SingletonKey.Audio);

		this._interactionService = Singletons.Load<IInteractionService<CamouflageContext>>(
			SingletonKey.CamouflageInteraction
		);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
	}

	public Register(mapContext: CamouflageBlueprint): void {
		this._keyService.DefineKey(this);

		GameSettings.Init();
		GameSettings.SetNormalSpeed();
		this._blueprint = mapContext;
		this._updateService.Register();
		this._app = this._appProvider.Provide(mapContext);
		this._interactionManager = new PIXI.InteractionManager(this._app.renderer);

		this._layerService.Register(this._app);
		this._gameContextService.Register(mapContext);
		const gameContext = this._gameContextService.Publish();
		this._interactionService.Register(this._interactionManager, gameContext);
		this._gameAudioService = new CamouflageAudioManager(mapContext, gameContext);
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

	public Context(): CamouflageBlueprint {
		return this._blueprint;
	}

	public Collect(): void {
		this._gameAudioService.StopAll();
		this._interactionManager.destroy();
		this._gameContextService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._networkService.Collect();
		this._audioService.Collect();
		this._app.destroy();
		this._app = null;
		this._audioService.Reload();
	}
}
