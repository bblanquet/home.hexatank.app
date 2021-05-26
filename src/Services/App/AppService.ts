import { BrainInjecter } from './../../Core/Ia/Decision/BrainInjecter';
import { GameContext } from './../../Core/Framework/GameContext';
import { ISoundService } from './../Sound/ISoundService';
import { GameSoundManager } from '../../Core/Framework/Sound/GameSoundManager';
import { IKeyService } from './../Key/IKeyService';
import { GameSettings } from './../../Core/Framework/GameSettings';
import { IInteractionService } from './../Interaction/IInteractionService';
import { INetworkService } from './../Network/INetworkService';
import { ILayerService } from './../Layer/ILayerService';
import { IUpdateService } from './../Update/IUpdateService';
import { IGameContextService } from './../GameContext/IGameContextService';
import { AppProvider } from './../../Core/App/AppProvider';
import { MapContext } from './../../Core/Setup/Generator/MapContext';
import { IAppService } from './IAppService';
import { Factory, FactoryKey } from '../../Factory';
import * as PIXI from 'pixi.js';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { GameStatus } from '../../Core/Framework/GameStatus';

export class AppService implements IAppService {
	private _context: MapContext;
	private _gameContext: GameContext;
	private _app: PIXI.Application;
	private _appProvider: AppProvider;
	private _interactionManager: PIXI.InteractionManager;
	private _soundManager: GameSoundManager;

	private _gameContextService: IGameContextService;
	private _interactionService: IInteractionService;
	private _layerService: ILayerService;
	private _updateService: IUpdateService;
	private _networkService: INetworkService;
	private _keyService: IKeyService;
	private _soundService: ISoundService;
	private _playerProfilService: IPlayerProfilService;

	constructor() {
		this._appProvider = new AppProvider();
		this._gameContextService = Factory.Load<IGameContextService>(FactoryKey.GameContext);
		this._updateService = Factory.Load<IUpdateService>(FactoryKey.Update);
		this._networkService = Factory.Load<INetworkService>(FactoryKey.Network);
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
		this._interactionService = Factory.Load<IInteractionService>(FactoryKey.Interaction);
		this._keyService = Factory.Load<IKeyService>(FactoryKey.Key);
		this._soundService = Factory.Load<ISoundService>(FactoryKey.Sound);
		this._playerProfilService = Factory.Load<IPlayerProfilService>(FactoryKey.PlayerProfil);
	}

	public Register(mapContext: MapContext): void {
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
		this._gameContext.RecordContext = new RecordContext(
			mapContext,
			this._gameContext,
			this._interactionService.Publish()
		);
		//new BrainInjecter().Inject();
		this._app.start();
		this._soundService.Register(this._gameContext);
		this._soundManager = this._soundService.GetSoundManager();
		this._gameContext.GameStatusChanged.On(this.SaveRecord.bind(this));
	}

	private SaveRecord(e: any, status: GameStatus) {
		if (status === GameStatus.Lost || status === GameStatus.Won) {
			const record = this._gameContext.RecordContext.GetRecord();
			const profil = this._playerProfilService.GetProfil();
			profil.Records.push(record);
		}
	}

	public Publish(): PIXI.Application {
		return this._app;
	}

	public Context(): MapContext {
		return this._context;
	}

	public Collect(): void {
		this._soundManager.StopAll();
		this._soundService.Collect();
		this._interactionManager.destroy();
		this._gameContextService.Collect();
		this._interactionService.Collect();
		this._layerService.Collect();
		this._updateService.Collect();
		this._networkService.Collect();
		this._app.destroy();
		this._app = null;
		this._soundService.Reload();
	}
}
