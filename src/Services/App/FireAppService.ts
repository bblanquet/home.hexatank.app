import { FireContext } from '../../Core/Framework/Context/FireContext';
import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { StatsContext } from '../../Core/Framework/Stats/StatsContext';
import { IInteractionService } from '../Interaction/IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { IUpdateService } from '../Update/IUpdateService';
import { IGameContextService } from '../GameContext/IGameContextService';
import { AppProvider } from '../../Core/Framework/App/AppProvider';
import { IAppService } from './IAppService';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { IKeyService } from '../Key/IKeyService';
import { CellStateSetter } from '../../Core/Items/Cell/CellStateSetter';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { IAudioService } from '../Audio/IAudioService';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { GameState } from '../../Core/Framework/Context/GameState';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { GameAudioManager } from '../../Core/Framework/Audio/GameAudioManager';
import { CellState } from '../../Core/Items/Cell/CellState';

export class FireAppService implements IAppService<FireBlueprint> {
	private _blueprint: FireBlueprint;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _interactionManager: PIXI.InteractionManager;
	private _gameAudioService: GameAudioManager;

	private _playerProfilService: IPlayerProfilService;
	private _gameContextService: IGameContextService<FireBlueprint, FireContext>;
	private _context: FireContext;
	private _interactionService: IInteractionService<FireContext>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;
	private _victory: () => void;
	private _defeat: () => void;
	public OnRefresh: SimpleEvent = new SimpleEvent();

	constructor() {
		this._appProvider = new AppProvider();
		this._gameContextService = Singletons.Load<IGameContextService<FireBlueprint, FireContext>>(
			SingletonKey.FireGameContext
		);
		this._playerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._interactionService = Singletons.Load<IInteractionService<FireContext>>(SingletonKey.Interaction);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._audioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
	}

	public Register(blueprint: FireBlueprint, victory: () => void, defeat: () => void): void {
		this._keyService.DefineKey(this);

		this._victory = victory;
		this._defeat = defeat;
		GameSettings.Init();
		GameSettings.SetNormalSpeed();
		const gameState = new GameState();
		this._blueprint = blueprint;
		this._app = this._appProvider.Provide(blueprint);
		this._interactionManager = new PIXI.InteractionManager(this._app.renderer);
		this._updateService.Register(gameState);
		this._layerService.Register(this._app);
		this._gameContextService.Register(blueprint, gameState);
		this._context = this._gameContextService.Publish();
		this._interactionService.Register(this._interactionManager, this._context);
		this._gameAudioService = new GameAudioManager(blueprint.MapMode, this._context);
		this._audioService.Register(this._gameAudioService);
		this._context.State.OnGameStatusChanged.On(this.GameStatusChanged.bind(this));

		this._app.start();

		CellStateSetter.SetStates(this._context.GetCells());
		this._context.GetCells().forEach((c) => {
			c.SetState(CellState.Visible);
			c.AlwaysVisible();
		});
	}

	Retry(): void {
		this._context.State.OnGameStatusChanged.Off(this.GameStatusChanged.bind(this));
		this.Collect();
		this.Register(this._blueprint, this._victory, this._defeat);
		this.OnRefresh.Invoke();
	}

	IsRetriable(): boolean {
		return true;
	}

	private GameStatusChanged(e: any, status: GameStatus) {
		if (status === GameStatus.Victory) {
			this._victory();
		} else if (status === GameStatus.Defeat) {
			this._defeat();
		}
		this._playerProfilService.Save();
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

	public Context(): FireBlueprint {
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
		this._app.destroy();
		this._app = null;
	}
}
