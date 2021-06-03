import { IAppService } from '../../Services/App/IAppService';
import { IUpdateService } from '../../Services/Update/IUpdateService';
import { ItemsUpdater } from '../../Core/ItemsUpdater';
import { Component, h } from 'preact';
import { Singletons, SingletonKey } from '../../Singletons';
import { ILayerService } from '../../Services/Layer/ILayerService';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';
import { IKeyService } from '../../Services/Key/IKeyService';
import { IsMobile } from '../../Core/Utils/ToolBox';
import { IGameContext } from '../../Core/Setup/Context/IGameContext';
import { IBlueprint } from '../../Core/Setup/Blueprint/IBlueprint';

export default class CanvasComponent extends Component<
	{ gameContext: IGameContextService<IBlueprint, IGameContext> },
	{}
> {
	private _gameCanvas: HTMLDivElement;
	private _updater: ItemsUpdater;
	private _appService: IAppService<IBlueprint>;
	private _keyService: IKeyService;
	private _layerService: ILayerService;
	private _stop: boolean;
	private _width: number;
	private _height: number;

	constructor() {
		super();
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._appService = Singletons.Load<IAppService<IBlueprint>>(this._keyService.GetAppKey());
		this._updater = Singletons.Load<IUpdateService>(SingletonKey.Update).Publish();
		this._stop = true;
	}

	componentDidMount() {
		this._stop = false;
		window.addEventListener('resize', () => this.ResizeTheCanvas());
		window.addEventListener('DOMContentLoaded', () => this.ResizeTheCanvas());
		window.addEventListener('scroll', () => this.ResizeTheCanvas());
		this._gameCanvas.appendChild(this._appService.Publish().view);
		this.ResizeTheCanvas();
		this.SetCenter();
		this.GameLoop();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', () => this.ResizeTheCanvas());
		window.removeEventListener('DOMContentLoaded', () => this.ResizeTheCanvas());
		window.removeEventListener('scroll', () => this.ResizeTheCanvas());
		Singletons.Load<IAppService<IBlueprint>>(this._keyService.GetAppKey()).Collect();
	}

	private GameLoop(): void {
		if (this._stop) {
			return;
		}
		requestAnimationFrame(() => this.GameLoop());
		this._updater.Update();
	}

	componentDidUpdate() {}

	render() {
		return (
			<div
				ref={(dom) => {
					this._gameCanvas = dom;
				}}
			/>
		);
	}

	protected SetCenter(): void {
		const gameContext = this.props.gameContext.Publish();
		if (gameContext && gameContext.GetPlayer()) {
			const player = gameContext.GetPlayer();
			const hqPoint = player.GetBoundingBox().GetCentralPoint();
			const halfWidth = this._width / 2;
			const halfHeight = this._height / 2;
			this._updater.ViewContext.SetX(-(hqPoint.X - halfWidth));
			this._updater.ViewContext.SetY(-(hqPoint.Y - halfHeight));
		}
	}

	public ResizeTheCanvas(): void {
		const viewPort = this._layerService.GetViewport();
		if (IsMobile()) {
			this._appService.Publish().renderer.resize(screen.width, screen.height);
			viewPort.screenWidth = screen.width;
			viewPort.screenHeight = screen.height;
			viewPort.worldWidth = screen.width;
			viewPort.worldHeight = screen.height;
			this._width = screen.width;
			this._height = screen.height;
		} else {
			this._appService.Publish().renderer.resize(window.innerWidth, window.innerHeight);
			viewPort.screenWidth = window.innerWidth;
			viewPort.screenHeight = window.innerHeight;
			viewPort.worldWidth = window.innerWidth;
			viewPort.worldHeight = window.innerHeight;
			this._width = window.innerWidth;
			this._height = window.innerHeight;
		}
	}
}
