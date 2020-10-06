import { IGameContextService } from '../../../Services/GameContext/IGameContextService';
import { Component, h } from 'preact';
import { ISelectable } from '../../../Core/ISelectable';
import { RecordCanvasUpdater } from './Updaters/RecordCanvasUpdater';
import RangeComponent from '../../Common/Range/RangeComponent';
import { Item } from '../../../Core/Items/Item';
import UnitMenuComponent from './Parts/UnitMenuComponent';
import { Vehicle } from '../../../Core/Items/Unit/Vehicle';
import CanvasComponent from '../CanvasComponent';
import { IRecordService } from '../../../Services/Record/IRecordService';
import { Factory, FactoryKey } from '../../../Factory';
import { route } from 'preact-router';
import Redirect from '../../Redirect/RedirectComponent';

export default class RecordCanvasComponent extends Component<
	{},
	{
		Item: Item;
	}
> {
	private _recordService: IRecordService;
	private _gameService: IGameContextService;
	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };
	private _updater: RecordCanvasUpdater;

	constructor() {
		super();
		this._gameService = Factory.Load<IGameContextService>(FactoryKey.GameContext);
		this._recordService = Factory.Load<IRecordService>(FactoryKey.Record);
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
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
		const context = this._gameService.Publish();
		this._updater = new RecordCanvasUpdater(this.GetRecord(), context);
		context.OnItemSelected.On(this.UpdateSelection.bind(this));
	}

	private GetRecord() {
		return this._recordService.Publish();
	}

	componentWillUnmount() {}

	componentDidUpdate() {}

	render() {
		return (
			<Redirect>
				<div style="width=100%">
					{this.TopMenuRender()}
					<div class="absolute-center-bottom full-width">
						<RangeComponent
							dataSet={this.GetRecord().Dates}
							onChange={(e: number) => this.HandleRangeChanged(e)}
						/>
					</div>
					<CanvasComponent />
					{this.LeftMenuRender()}
				</div>
			</Redirect>
		);
	}

	private LeftMenuRender() {
		if (this.state.Item) {
			return <UnitMenuComponent Vehicle={this.state.Item as Vehicle} />;
		}
		return '';
	}

	private SetMenu(): void {
		route('/Home', true);
	}

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

	private HandleRangeChanged(e: number): void {
		this._updater.SetDate(e);
	}
}
