import { DiamondAudioManager } from './../../Core/Framework/Audio/DiamondAudioManager';
import { DiamondBlueprint } from './../../Core/Setup/Blueprint/Diamond/DiamondBlueprint';
import { DiamondContext } from './../../Core/Setup/Context/DiamondContext';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { StatsContext } from '../../Core/Framework/Stats/StatsContext';
import { IInteractionService } from '../Interaction/IInteractionService';
import { INetworkService } from '../Network/INetworkService';
import { ILayerService } from '../Layer/ILayerService';
import { IUpdateService } from '../Update/IUpdateService';
import { IGameContextService } from '../GameContext/IGameContextService';
import { AppProvider } from '../../Core/App/AppProvider';
import { IAppService } from './IAppService';
import { Factory, FactoryKey } from '../../Factory';
import * as PIXI from 'pixi.js';
import { IKeyService } from '../Key/IKeyService';
import { CellStateSetter } from '../../Core/Items/Cell/CellStateSetter';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { IAudioService } from '../Audio/IAudioService';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { GameStatus } from '../../Core/Framework/GameStatus';

export class DiamondAppService implements IAppService<DiamondBlueprint> {
	private _blueprint: DiamondBlueprint;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _interactionManager: PIXI.InteractionManager;
	private _gameAudioService: DiamondAudioManager;

	private _gameContextService: IGameContextService<DiamondBlueprint, DiamondContext>;
	private _interactionService: IInteractionService<DiamondContext>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _networkService: INetworkService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;

	constructor() {
		this._appProvider = new AppProvider();
		this._gameContextService = Factory.Load<IGameContextService<DiamondBlueprint, DiamondContext>>(
			FactoryKey.DiamondGameContext
		);
		this._updateService = Factory.Load<IUpdateService>(FactoryKey.Update);
		this._networkService = Factory.Load<INetworkService>(FactoryKey.Network);
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
		this._interactionService = Factory.Load<IInteractionService<DiamondContext>>(FactoryKey.DiamondInteraction);
		this._keyService = Factory.Load<IKeyService>(FactoryKey.Key);
		this._audioService = Factory.Load<IAudioService>(FactoryKey.Audio);
	}

	public Register(blueprint: DiamondBlueprint): void {
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

		this._gameAudioService = new DiamondAudioManager(blueprint, gameContext);
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

	public Context(): DiamondBlueprint {
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
