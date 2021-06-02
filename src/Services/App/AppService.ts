import { AudioArchive } from './../../Core/Framework/AudioArchiver';
import { IAudioService } from './../Audio/IAudioService';
import { StatsContext } from './../../Core/Framework/Stats/StatsContext';
import { BrainInjecter } from './../../Core/Ia/Decision/BrainInjecter';
import { GameContext } from '../../Core/Setup/Context/GameContext';
import { GameAudioManager } from '../../Core/Framework/Sound/GameAudioManager';
import { IKeyService } from './../Key/IKeyService';
import { GameSettings } from './../../Core/Framework/GameSettings';
import { IInteractionService } from './../Interaction/IInteractionService';
import { INetworkService } from './../Network/INetworkService';
import { ILayerService } from './../Layer/ILayerService';
import { IUpdateService } from './../Update/IUpdateService';
import { IGameContextService } from './../GameContext/IGameContextService';
import { AppProvider } from './../../Core/App/AppProvider';
import { GameBlueprint } from '../../Core/Setup/Blueprint/Game/GameBlueprint';
import { IAppService } from './IAppService';
import { Factory, FactoryKey } from '../../Factory';
import * as PIXI from 'pixi.js';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { GameStatus } from '../../Core/Framework/GameStatus';

export class AppService implements IAppService<GameBlueprint> {
	private _context: GameBlueprint;
	private _gameContext: GameContext;
	private _recordContext: RecordContext;
	private _statContext: StatsContext;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _interactionManager: PIXI.InteractionManager;
	private _gameAudioService: GameAudioManager;

	private _gameContextService: IGameContextService<GameBlueprint, GameContext>;
	private _interactionService: IInteractionService<GameContext>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _networkService: INetworkService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;
	private _playerProfilService: IPlayerProfilService;

	constructor() {
		this._appProvider = new AppProvider();
		this._gameContextService = Factory.Load<IGameContextService<GameBlueprint, GameContext>>(
			FactoryKey.GameContext
		);
		this._updateService = Factory.Load<IUpdateService>(FactoryKey.Update);
		this._networkService = Factory.Load<INetworkService>(FactoryKey.Network);
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
		this._interactionService = Factory.Load<IInteractionService<GameContext>>(FactoryKey.Interaction);
		this._keyService = Factory.Load<IKeyService>(FactoryKey.Key);
		this._audioService = Factory.Load<IAudioService>(FactoryKey.Audio);
		this._playerProfilService = Factory.Load<IPlayerProfilService>(FactoryKey.PlayerProfil);
	}
	GetStats(): StatsContext {
		return this._statContext;
	}
	GetRecord(): RecordContext {
		return this._recordContext;
	}

	public Register(mapContext: GameBlueprint): void {
		this._keyService.DefineKey(this);

		GameSettings.Init();
		GameSettings.SetNormalSpeed();
		this._context = mapContext;
		this._updateService.Register();
		this._app = this._appProvider.Provide(mapContext);

		this._layerService.Register(this._app);
		this._interactionManager = new PIXI.InteractionManager(this._app.renderer);
		this._gameContextService.Register(mapContext);
		this._gameContext = this._gameContextService.Publish();
		this._interactionService.Register(this._interactionManager, this._gameContext);
		this._recordContext = new RecordContext(mapContext, this._gameContext, this._interactionService.Publish());
		this._statContext = new StatsContext(this._gameContext);
		new BrainInjecter().Inject(this._gameContext, mapContext);
		this._app.start();
		this._gameAudioService = new GameAudioManager(mapContext, this._gameContext);
		this._audioService.Register(this._gameAudioService);
		this._gameContext.OnGameStatusChanged.On(this.GameStatusChanged.bind(this));
	}

	private GameStatusChanged(e: any, status: GameStatus) {
		if (status === GameStatus.Defeat) {
			this._audioService.Play(AudioArchive.defeat, 0.5, false);
		}

		if (status === GameStatus.Victory) {
			this._audioService.Play(AudioArchive.victory, 0.5, false);
		}

		if (status === GameStatus.Defeat || status === GameStatus.Victory) {
			const record = this._recordContext.GetRecord();
			const profil = this._playerProfilService.GetProfil();
			profil.Records.push(record);
		}
	}

	public Publish(): PIXI.Application {
		return this._app;
	}

	public Context(): GameBlueprint {
		return this._context;
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
