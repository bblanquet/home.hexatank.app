import { IAppService } from '../../Services/App/IAppService';
import { IUpdateService } from '../../Services/Update/IUpdateService';
import { ItemsUpdater } from '../../Core/ItemsUpdater';
import { Component, h } from 'preact';
import { Factory, FactoryKey } from '../../Factory';
import { ILayerService } from '../../Services/Layer/ILayerService';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';

export default class CanvasComponent extends Component<{}, {}> {
	private _gameCanvas: HTMLDivElement;
	private _updater: ItemsUpdater;
	private _appService: IAppService;
	private _gameContextService: IGameContextService;
	private _layerService: ILayerService;
	private _stop: boolean;
	private _width: number;
	private _height: number;

	constructor() {
		super();
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
		this._appService = Factory.Load<IAppService>(FactoryKey.App);
		this._updater = Factory.Load<IUpdateService>(FactoryKey.Update).Publish();
		this._gameContextService = Factory.Load<IGameContextService>(FactoryKey.GameContext);
		this._stop = true;
	}

	componentDidMount() {
		this._stop = false;
		window.addEventListener('resize', () => this.ResizeTheCanvas());
		window.addEventListener('DOMContentLoaded', () => this.ResizeTheCanvas());
		this._gameCanvas.appendChild(this._appService.Publish().view);
		this.ResizeTheCanvas();
		this.SetCenter();
		this.GameLoop();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', () => this.ResizeTheCanvas());
		window.removeEventListener('DOMContentLoaded', () => this.ResizeTheCanvas());
		Factory.Load<IAppService>(FactoryKey.App).Collect();
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
		const hqPoint = this._gameContextService.Publish().GetMainHq().GetBoundingBox().GetCentralPoint();
		const halfWidth = this._width / 2;
		const halfHeight = this._height / 2;
		this._updater.ViewContext.SetX(-(hqPoint.X - halfWidth));
		this._updater.ViewContext.SetY(-(hqPoint.Y - halfHeight));
	}

	public ResizeTheCanvas(): void {
		const viewPort = this._layerService.GetViewport();
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
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
