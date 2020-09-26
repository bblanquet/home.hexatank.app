import { Component, h } from 'preact';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { ISelectable } from '../../Core/ISelectable';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { TrackingAppHandler } from '../../Core/App/TrackingAppHandler';

export default class LightCanvasComponent extends Component<any, {}> {
	private _gameCanvas: HTMLDivElement;
	private _stop: boolean;
	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };
	private _appHandler: TrackingAppHandler;

	constructor() {
		super();
		this._stop = true;
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
		this.setState({});
	}
	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
			this.setState({
				...this.state,
				Item: null
			});
		}
	}

	componentDidMount() {
		GameSettings.Init();
		this._stop = false;
		this._appHandler = new TrackingAppHandler();
		this._appHandler.SetupGameContext();
		this._gameCanvas.appendChild(this._appHandler.GetApp().view);
		this.GameLoop();
	}

	private GameLoop(): void {
		if (this._stop) {
			return;
		}
		requestAnimationFrame(() => this.GameLoop());
		GameHelper.Updater.Update();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', () => this._appHandler.ResizeTheCanvas());
		window.removeEventListener('DOMContentLoaded', () => this._appHandler.ResizeTheCanvas());

		this._appHandler.Clear();
		this._gameCanvas = null;
	}

	componentDidUpdate() {}

	render() {
		return (
			<div style="width=100%">
				{this.TopMenuRender()}
				{this.BottomMenuRender()}
				<div
					ref={(dom) => {
						this._gameCanvas = dom;
					}}
				/>
			</div>
		);
	}

	private SetMenu(): void {}

	private TopMenuRender() {
		return (
			<div style="position: fixed;left: 50%;transform: translateX(-50%);">
				<button
					type="button"
					class="btn btn-dark small-space space-out fill-option"
					onClick={() => this.SetMenu()}
				/>
			</div>
		);
	}

	private BottomMenuRender() {
		return (
			<div class="absolute-center-bottom full-width">
				<form>
					<div class="form-group">
						<label for="formControlRange">Example Range input</label>
						<input type="range" class="form-control-range" id="formControlRange" />
					</div>
				</form>
			</div>
		);
	}
}
