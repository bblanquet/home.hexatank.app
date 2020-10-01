import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { INetworkService } from './../Network/INetworkService';
import { TYPES } from '../../types';
import { ILayerService } from './../Layer/ILayerService';
import { IUpdateService } from './../Update/IUpdateService';
import { IGameContextService } from './../GameContext/IGameContextService';
import { AppProvider } from './../../Core/App/AppProvider';
import { MapContext } from './../../Core/Setup/Generator/MapContext';
import { IAppService } from './IAppService';
import { IInteractionService } from '../Interaction/IInteractionService';

@injectable()
export class AppService implements IAppService {
	private _context: MapContext;
	private _app: PIXI.Application;
	@inject(TYPES.Empty) private _gameContextService: IGameContextService;
	@inject(TYPES.Empty) private _interactionService: IInteractionService;
	@inject(TYPES.Empty) private _layerService: ILayerService;
	@inject(TYPES.Empty) private _updateService: IUpdateService;
	@inject(TYPES.Empty) private _networkService: INetworkService;

	public Register(mapContext: MapContext): void {
		this._context = mapContext;
		const appProvider = new AppProvider();
		this._app = appProvider.Provide(mapContext);
		this._layerService.Register(this._app);
		this._gameContextService.Register(mapContext);
		const gameContext = this._gameContextService.Publish();
		this._interactionService.Register(this._app, gameContext);
		this._updateService.Register();
	}

	public Publish(): HTMLElement {
		return this._app.view;
	}

	public Context(): MapContext {
		return this._context;
	}

	public Collect(): void {
		this._gameContextService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._networkService.Collect();
		this._app.destroy();
		this._app = null;
	}
}
