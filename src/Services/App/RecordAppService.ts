import { BattleBlueprint } from './../../Core/Setup/Blueprint/Battle/BattleBlueprint';
import { GameSettings } from './../../Core/Framework/GameSettings';
import { IInteractionService } from './../Interaction/IInteractionService';
import { INetworkService } from './../Network/INetworkService';
import { ILayerService } from './../Layer/ILayerService';
import { IUpdateService } from './../Update/IUpdateService';
import { IGameContextService } from './../GameContext/IGameContextService';
import { AppProvider } from './../../Core/App/AppProvider';
import { IAppService } from './IAppService';
import { Factory, FactoryKey } from '../../Factory';
import * as PIXI from 'pixi.js';
import { IKeyService } from '../Key/IKeyService';
import { CellStateSetter } from '../../Core/Items/Cell/CellStateSetter';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { StatsContext } from '../../Core/Framework/Stats/StatsContext';
import { GameContext } from '../../Core/Setup/Context/GameContext';

export class RecordAppService implements IAppService<BattleBlueprint> {
	private _context: BattleBlueprint;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _interactionManager: PIXI.InteractionManager;

	private _gameContextService: IGameContextService<BattleBlueprint, GameContext>;
	private _interactionService: IInteractionService<GameContext>;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _networkService: INetworkService;
	private _keyService: IKeyService;

	constructor() {
		this._appProvider = new AppProvider();
		this._gameContextService = Factory.Load<IGameContextService<BattleBlueprint, GameContext>>(
			FactoryKey.GameContext
		);
		this._updateService = Factory.Load<IUpdateService>(FactoryKey.Update);
		this._networkService = Factory.Load<INetworkService>(FactoryKey.Network);
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
		this._interactionService = Factory.Load<IInteractionService<GameContext>>(FactoryKey.RecordInteraction);
		this._keyService = Factory.Load<IKeyService>(FactoryKey.Key);
	}
	GetStats(): StatsContext {
		return null;
	}
	GetRecord(): RecordContext {
		return null;
	}

	public Register(mapContext: BattleBlueprint): void {
		this._keyService.DefineKey(this);

		GameSettings.Init();
		GameSettings.SetNormalSpeed();
		this._context = mapContext;
		this._updateService.Register();
		this._app = this._appProvider.Provide(mapContext);
		this._interactionManager = new PIXI.InteractionManager(this._app.renderer);

		this._layerService.Register(this._app);
		this._gameContextService.Register(mapContext);
		const gameContext = this._gameContextService.Publish();
		this._interactionService.Register(this._interactionManager, gameContext);

		gameContext.GetCells().forEach((c) => {
			c.AlwaysVisible();
		});
		CellStateSetter.SetStates(gameContext.GetCells());
		this._app.start();
	}

	public Publish(): PIXI.Application {
		return this._app;
	}

	public Context(): BattleBlueprint {
		return this._context;
	}

	public Collect(): void {
		this._interactionManager.destroy();
		this._gameContextService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._networkService.Collect();
		this._app.destroy();
		this._app = null;
	}
}
