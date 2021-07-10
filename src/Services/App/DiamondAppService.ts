import { DiamondAudioManager } from './../../Core/Framework/Audio/DiamondAudioManager';
import { DiamondBlueprint } from './../../Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import { DiamondContext } from './../../Core/Framework/Context/DiamondContext';
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
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';

export class DiamondAppService implements IAppService<DiamondBlueprint> {
	private _blueprint: DiamondBlueprint;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _interactionManager: PIXI.InteractionManager;
	private _gameAudioService: DiamondAudioManager;
	private _context: DiamondContext;

	private _gameContextService: IGameContextService<DiamondBlueprint, DiamondContext>;
	private _interactionService: IInteractionService<DiamondContext>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _keyService: IKeyService;
	private _audioService: IAudioService;
	private _victory: () => void;
	private _defeat: () => void;
	public OnRetried: SimpleEvent = new SimpleEvent();

	public Register(blueprint: DiamondBlueprint, victory: () => void, defeat: () => void): void {
		this._appProvider = new AppProvider();
		this._gameContextService = Singletons.Load<IGameContextService<DiamondBlueprint, DiamondContext>>(
			SingletonKey.DiamondGameContext
		);
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._interactionService = Singletons.Load<IInteractionService<DiamondContext>>(
			SingletonKey.DiamondInteraction
		);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._audioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
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

		this._gameAudioService = new DiamondAudioManager(blueprint, this._context);
		this._audioService.Register(this._gameAudioService);
		this._context.State.OnGameStatusChanged.On(this.GameStatusChanged.bind(this));

		this._context.GetCells().forEach((c) => {
			c.AlwaysVisible();
		});
		CellStateSetter.SetStates(this._context.GetCells());
		this._app.start();
	}

	Retry(): void {
		this._context.State.OnGameStatusChanged.Off(this.GameStatusChanged.bind(this));
		this.Collect();
		this.Register(this._blueprint, this._victory, this._defeat);
		this.OnRetried.Invoke();
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
		this._audioService.Clear();
		this._interactionManager.destroy();
		this._gameContextService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._app.destroy();
		this._app = null;
		this._audioService.PlayLoungeMusic();
	}
}
