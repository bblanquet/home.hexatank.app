import { RecordContext } from './../../../Core/Framework/Record/RecordContext';
import { StatsContext } from './../../../Core/Framework/Stats/StatsContext';
import { IInteractionService } from './../../Interaction/IInteractionService';
import { INetworkService } from './../../Network/INetworkService';
import { ILayerService } from './../../Layer/ILayerService';
import { IUpdateService } from './../../Update/IUpdateService';
import { IGameContextService } from './../../GameContext/IGameContextService';
import { AppProvider } from './../../../Core/App/AppProvider';
import { MapContext } from './../../../Core/Setup/Generator/MapContext';
import { IAppService } from '../IAppService';
import { Factory, FactoryKey } from '../../../Factory';
import * as PIXI from 'pixi.js';
import { IKeyService } from '../../Key/IKeyService';
import { CellStateSetter } from '../../../Core/Items/Cell/CellStateSetter';
import { GameSettings } from '../../../Core/Framework/GameSettings';

export class CamouflageAppService implements IAppService {
	private _context: MapContext;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _interactionManager: PIXI.InteractionManager;

	private _gameContextService: IGameContextService;
	private _interactionService: IInteractionService;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _networkService: INetworkService;
	private _keyService: IKeyService;

	constructor() {
		this._appProvider = new AppProvider();
		this._gameContextService = Factory.Load<IGameContextService>(FactoryKey.GameContext);
		this._updateService = Factory.Load<IUpdateService>(FactoryKey.Update);
		this._networkService = Factory.Load<INetworkService>(FactoryKey.Network);
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
		this._interactionService = Factory.Load<IInteractionService>(FactoryKey.RecordInteraction);
		this._keyService = Factory.Load<IKeyService>(FactoryKey.Key);
	}

	public Register(mapContext: MapContext): void {
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

	GetStats(): StatsContext {
		return null;
	}
	GetRecord(): RecordContext {
		return null;
	}

	public Publish(): PIXI.Application {
		return this._app;
	}

	public Context(): MapContext {
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