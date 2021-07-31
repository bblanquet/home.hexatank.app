import { IOnlineService } from '../Online/IOnlineService';
import { IAudioService } from './../Audio/IAudioService';
import { StatsContext } from './../../Core/Framework/Stats/StatsContext';
import { BrainInjecter } from './../../Core/Ia/Decision/BrainInjecter';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import { GameAudioManager } from '../../Core/Framework/Audio/GameAudioManager';
import { IKeyService } from './../Key/IKeyService';
import { GameSettings } from './../../Core/Framework/GameSettings';
import { IInteractionService } from './../Interaction/IInteractionService';
import { ILayerService } from './../Layer/ILayerService';
import { IUpdateService } from './../Update/IUpdateService';
import { IGameContextService } from './../GameContext/IGameContextService';
import { AppProvider } from '../../Core/Framework/App/AppProvider';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IAppService } from './IAppService';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { CellStateSetter } from '../../Core/Items/Cell/CellStateSetter';
import { GameState } from '../../Core/Framework/Context/GameState';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { Env } from '../../Env';
import { CellState } from '../../Core/Items/Cell/CellState';

export class AppService implements IAppService<GameBlueprint> {
	private _blueprint: GameBlueprint;
	private _context: GameContext;
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
	private _onlineService: IOnlineService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;
	private _playerProfilService: IPlayerProfilService;
	private _gameStatusChanged: any = this.GameStatusChanged.bind(this);
	private _victory: () => void;
	private _defeat: () => void;
	public OnRefresh: SimpleEvent = new SimpleEvent();

	constructor() {
		this._appProvider = new AppProvider();
		this._gameContextService = Singletons.Load<IGameContextService<GameBlueprint, GameContext>>(
			SingletonKey.GameContext
		);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._onlineService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._interactionService = Singletons.Load<IInteractionService<GameContext>>(SingletonKey.Interaction);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._audioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._playerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
	}

	GetStats(): StatsContext {
		return this._statContext;
	}
	GetRecord(): RecordContext {
		return this._recordContext;
	}

	Retry(): void {
		this._context.State.OnGameStatusChanged.Off(this.GameStatusChanged.bind(this));
		this.Collect();
		this.Register(this._blueprint, this._victory, this._defeat);
		this.OnRefresh.Invoke();
	}

	IsRetriable(): boolean {
		return !this._onlineService.IsOnline();
	}

	public Register(blueprint: GameBlueprint, victory: () => void, defeat: () => void): void {
		this._keyService.DefineKey(this);

		GameSettings.Init();
		GameSettings.SetFastSpeed();
		if (Env.IsPrd()) {
			GameSettings.SetNormalSpeed();
		}
		const gameState = new GameState();
		this._blueprint = blueprint;

		this._victory = victory;
		this._defeat = defeat;
		this._app = this._appProvider.Provide(blueprint);
		this._layerService.Register(this._app);
		this._updateService.Register(gameState);
		this._interactionManager = new PIXI.InteractionManager(this._app.renderer);
		this._gameContextService.Register(blueprint, gameState);
		this._context = this._gameContextService.Publish();
		this._interactionService.Register(this._interactionManager, this._context);
		this._recordContext = new RecordContext(blueprint, this._context);
		this._statContext = new StatsContext(this._context);
		new BrainInjecter().Inject(this._context.GetHqs(), this._context.GetCells(), blueprint.Hqs);
		this._app.start();
		this._gameAudioService = new GameAudioManager(blueprint.MapMode, this._context);
		this._audioService.Register(this._gameAudioService);
		this._context.State.OnGameStatusChanged.On(this._gameStatusChanged);

		CellStateSetter.SetStates(this._context.GetCells());
		this._context.GetCells().forEach((c) => {
			c.SetState(CellState.Visible);
			c.AlwaysVisible();
		});
	}

	private GameStatusChanged(e: any, status: GameStatus): void {
		if (status === GameStatus.Defeat || status === GameStatus.Victory) {
			if (status === GameStatus.Victory) {
				this._victory();
			}
			if (status === GameStatus.Defeat) {
				this._defeat();
			}
			this._recordContext.Stop(status === GameStatus.Victory);
			const record = this._recordContext.GetRecord();
			this._playerProfilService.Load();
			const profil = this._playerProfilService.GetProfil();
			profil.Records.push(record);
			this._playerProfilService.Save();
		}
	}

	public Publish(): PIXI.Application {
		return this._app;
	}

	public Context(): GameBlueprint {
		return this._blueprint;
	}

	public Collect(): void {
		this._gameAudioService.StopAll();
		this._audioService.Clear();
		this._interactionManager.destroy();
		this._gameContextService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._onlineService.Collect();
		this._app.destroy();
		this._app = null;
	}
}
