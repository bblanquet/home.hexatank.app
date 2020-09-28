import { Component, h } from 'preact';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { ISelectable } from '../../Core/ISelectable';
import { RecordCanvasUpdater } from './Updaters/RecordCanvasUpdater';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { TrackingAppHandler } from '../../Core/App/TrackingAppHandler';
import RangeComponent from '../Common/Range/RangeComponent';
import { Item } from '../../Core/Items/Item';
import UnitMenuComponent from './Parts/UnitMenuComponent';
import { Vehicle } from '../../Core/Items/Unit/Vehicle';

export default class RecordCanvasComponent extends Component<
	{},
	{
		dataSet: number[];
		Item: Item;
	}
> {
	private _gameCanvas: HTMLDivElement;
	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };
	private _appHandler: TrackingAppHandler;
	private _updater: RecordCanvasUpdater;

	constructor() {
		super();
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
		this.setState({ dataSet: [] });
	}
	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
			this.setState({
				Item: null
			});
		}
	}

	componentDidMount() {
		GameSettings.Init();
		this._appHandler = new TrackingAppHandler();
		const context = this._appHandler.SetupGameContext();
		this._gameCanvas.appendChild(this._appHandler.GetApp().view);
		this._updater = new RecordCanvasUpdater(GameHelper.Record, context);
		context.OnItemSelected.On(this.UpdateSelection.bind(this));
		this.setState({
			dataSet: GameHelper.Record.Dates
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
			return <UnitMenuComponent AppHandler={this._appHandler} Vehicle={this.state.Item as Vehicle} />;
		}
		return '';
	}

	private SetMenu(): void {}

	private UpdateSelection(obj: any, selectedItem: Item): void {
		((selectedItem as unknown) as ISelectable).OnSelectionChanged.On(this._onItemSelectionChanged);
		this.setState({
			Item: selectedItem
		});
	}

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
