import { IBuilder } from '../../Services/Builder/IBuilder';
import { IUpdateService } from '../../Services/Update/IUpdateService';
import { ItemsUpdater } from '../../Core/ItemsUpdater';
import { Component, h } from 'preact';
import { Singletons, SingletonKey } from '../../Singletons';
import { ILayerService } from '../../Services/Layer/ILayerService';
import { IKeyService } from '../../Services/Key/IKeyService';
import { IsMobile } from '../../Utils/ToolBox';
import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';
import PageAnalyser from './PageAnalyser';
import { Point } from '../../Utils/Geometry/Point';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { IAppService } from '../../Services/App/IAppService';

export default class GameCanvas extends Component<{ Center: Point; OnRefresh: SimpleEvent; uncollect?: boolean }, {}> {
	private _gameCanvas: HTMLElement;
	private _resizeFunc: any = this.ResizeTheCanvas.bind(this);
	private _updater: ItemsUpdater;
	private _appService: IAppService;
	private _keyService: IKeyService;
	private _layerService: ILayerService;
	private _stop: boolean;
	private _width: number;
	private _height: number;

	constructor() {
		super();
		this._keyService = Singletons.Load<IKeyService>(SingletonKey.Key);
		this._appService = Singletons.Load<IAppService>(SingletonKey.App);
		this._stop = true;
	}

	private Init() {
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._updater = Singletons.Load<IUpdateService>(SingletonKey.Update).Publish();
		if (this._gameCanvas) {
			this._gameCanvas.innerHTML = '';
			this._gameCanvas.appendChild(this._appService.Publish().view);
			this.ResizeTheCanvas();
			this.SetCenter(this.props.Center);
			this.props.OnRefresh.On(() => {
				this.Init();
			});
		}
	}

	componentDidMount() {
		this._stop = false;
		window.addEventListener('resize', this._resizeFunc);
		window.addEventListener('DOMContentLoaded', this._resizeFunc);
		window.addEventListener('scroll', this._resizeFunc);

		this.Init();
		this.GameLoop();
	}

	SetCenter(point: Point) {
		if (point) {
			this.ResizeTheCanvas();
			const halfWidth = this._width / 2;
			const halfHeight = this._height / 2;
			this._updater.ViewContext.SetX(-(point.X - halfWidth));
			this._updater.ViewContext.SetY(-(point.Y - halfHeight));
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this._resizeFunc);
		window.removeEventListener('DOMContentLoaded', this._resizeFunc);
		window.removeEventListener('scroll', this._resizeFunc);
		if (!this.props.uncollect) {
			Singletons.Load<IBuilder<IBlueprint>>(this._keyService.GetAppKey()).Collect();
		}
	}

	private GameLoop(): void {
		if (this._stop) {
			return;
		}
		this._updater.Update();
		requestAnimationFrame(() => this.GameLoop());
	}

	render() {
		return (
			<PageAnalyser>
				<div
					style="overflow: hidden;display: block;"
					ref={(dom) => {
						this._gameCanvas = dom;
					}}
				/>
			</PageAnalyser>
		);
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
