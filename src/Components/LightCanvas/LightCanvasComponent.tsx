import { Component, h } from 'preact';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { ISelectable } from '../../Core/ISelectable';
import { LightCanvasUpdater } from './LightCanvasUpdater';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { TrackingAppHandler } from '../../Core/App/TrackingAppHandler';
import RangeComponent from '../Common/Range/RangeComponent';
import { Item } from '../../Core/Items/Item';
import { Tank } from '../../Core/Items/Unit/Tank';
import { Truck } from '../../Core/Items/Unit/Truck';
import TankMenuComponent from '../Canvas/Parts/TankMenuComponent';
import TruckMenuComponent from '../Canvas/Parts/TruckMenuComponent';

export default class LightCanvasComponent extends Component<
	{},
	{
		dataSet: number[];
		Item: Item;
	}
> {
	private _gameCanvas: HTMLDivElement;
	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };
	private _appHandler: TrackingAppHandler;
	private _updater: LightCanvasUpdater;

	constructor() {
		super();
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
		this.setState({ dataSet: [] });
	}
	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
		}
	}

	componentDidMount() {
		GameSettings.Init();
		this._appHandler = new TrackingAppHandler();
		const context = this._appHandler.SetupGameContext();
		this._gameCanvas.appendChild(this._appHandler.GetApp().view);
		this._updater = new LightCanvasUpdater(GameHelper.TackingDatas, context);
		this.setState({
			dataSet: GameHelper.TackingDatas.Dates
		});
		this.GameLoop();
	}

	private GameLoop(): void {
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
				{this.LeftMenuRender()}
			</div>
		);
	}

	private LeftMenuRender() {
		if (this.state.Item) {
			if (this.state.Item instanceof Tank) {
				return <TankMenuComponent AppHandler={this._appHandler} Tank={this.state.Item} />;
			} else if (this.state.Item instanceof Truck) {
				return <TruckMenuComponent AppHandler={this._appHandler} Truck={this.state.Item} />;
			}
		}
		return '';
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

	private HandleRangeChanged(e: any): void {
		this._updater.SetDate(e.target.value);
	}

	private BottomMenuRender() {
		return (
			<div class="absolute-center-bottom full-width">
				<RangeComponent dataSet={this.state.dataSet} onChange={(e: any) => this.HandleRangeChanged(e)} />
			</div>
		);
	}
}
