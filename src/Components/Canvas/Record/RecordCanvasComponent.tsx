import { IGameContextService } from '../../../Services/GameContext/IGameContextService';
import { Component, h } from 'preact';
import { ISelectable } from '../../../Core/ISelectable';
import { RecordCanvasUpdater } from './Updaters/RecordCanvasUpdater';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import RangeComponent from '../../Common/Range/RangeComponent';
import { Item } from '../../../Core/Items/Item';
import UnitMenuComponent from './Parts/UnitMenuComponent';
import { Vehicle } from '../../../Core/Items/Unit/Vehicle';
import CanvasComponent from '../CanvasComponent';
import { IRecordService } from '../../../Services/Record/IRecordService';
import { Factory, FactoryKey } from '../../../Factory';

export default class RecordCanvasComponent extends Component<
	{},
	{
		dataSet: number[];
		Item: Item;
	}
> {
	private _recordService: IRecordService;
	private _gameService: IGameContextService;
	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };
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
		this._gameService = Factory.Load<IGameContextService>(FactoryKey.GameContext);
		this._recordService = Factory.Load<IRecordService>(FactoryKey.Record);
		const context = this._gameService.Publish();
		const record = this._recordService.Publish();
		this._updater = new RecordCanvasUpdater(record, context);
		context.OnItemSelected.On(this.UpdateSelection.bind(this));
		this.setState({
			dataSet: record.Dates
		});
	}

	componentWillUnmount() {}

	componentDidUpdate() {}

	render() {
		return (
			<div style="width=100%">
				{this.TopMenuRender()}
				{this.BottomMenuRender()}
				<CanvasComponent />
				{this.LeftMenuRender()}
			</div>
		);
	}

	private LeftMenuRender() {
		if (this.state.Item) {
			return <UnitMenuComponent Vehicle={this.state.Item as Vehicle} />;
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
