import { ICompareService } from '../../Services/Compare/ICompareService';
import { h, Component } from 'preact';
import { route } from 'preact-router';
import { CompChartProvider } from '../Common/CompChartProvider';
import { RecordData } from '../../Core/Framework/Record/RecordData';
import { RecordComparer } from './Comparers/RecordComparer';
import DropDownComponent from '../Common/DropDown/DropDownComponent';
import { DeltaRecordCurve } from './Comparers/DeltaRecordCurve';
import TextComponent from '../Common/Text/TextComponent';
import { Factory, FactoryKey } from '../../Factory';
import Redirect from '../Redirect/RedirectComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import SmPanelComponent from '../Common/Panel/SmPanelComponent';

export default class ComparerComponent extends Component<
	{},
	{
		HqIds: string[];
		UnitIds: string[];
		SelectedHqId: string;
		SelectedUnitId: string;
		CurveIndex: number | null;
	}
> {
	private _compareService: ICompareService;
	private _trackingComparer: RecordComparer;
	private _chartProvider: CompChartProvider;

	private _canvas: HTMLCanvasElement;
	private _chart: Chart;
	private _d1: RecordData;
	private _d2: RecordData;

	constructor() {
		super();
		this._chartProvider = new CompChartProvider();
		this.setState({
			HqIds: [],
			UnitIds: [],
			SelectedHqId: '',
			SelectedUnitId: '',
			CurveIndex: null
		});
		this._compareService = Factory.Load<ICompareService>(FactoryKey.Compare);
	}

	componentWillMount() {
		if (this._compareService) {
			const result = this._compareService.Publish();
			if (result) {
				[ this._d1, this._d2 ] = result;
			}
		}
	}

	componentDidMount() {
		if (this._d1 && this._d2) {
			this._trackingComparer = new RecordComparer(this._d1, this._d2);
			const hqId = this._d1.Hqs.Keys()[0];
			const unitId = this._d1.Hqs.Get(hqId).Units.Keys()[0];
			this.setState({
				HqIds: this._d1.Hqs.Keys(),
				SelectedHqId: hqId,
				SelectedUnitId: unitId,
				UnitIds: this._d1.Hqs.Get(hqId).Units.Keys()
			});
		}
	}

	componentDidUpdate() {
		if (this.state.SelectedUnitId !== '') {
			this.UpdateCurve(this.state.SelectedUnitId);
		}
	}

	private Quit(): void {
		route('/Home', true);
	}

	render() {
		return (
			<Redirect>
				<SmPanelComponent>
					<div class="container-center">
						<div class="container-center-horizontal">
							<DropDownComponent
								OnInput={(e: any) =>
									this.setState({
										SelectedHqId: e.target.value,
										SelectedUnitId: this._d1.Hqs.Get(e.target.value).Units.Keys()[0]
									})}
								DefaultValue={this.state.SelectedHqId}
								Label={'Hq'}
								Values={this.state.HqIds}
							/>
							<div class="small-right-margin" />
							<DropDownComponent
								OnInput={(e: any) => {
									this.setState({
										SelectedUnitId: e.target.value
									});
								}}
								Label={'Unit'}
								DefaultValue={this.state.SelectedUnitId}
								Values={this.GetUnitIds()}
							/>
						</div>

						<canvas
							style="border-radius: 10px; margin-top:30px; margin-bottom:20px"
							ref={(e) => {
								this._canvas = e;
							}}
							onClick={(e: any) => {
								var activePoints = this._chart.getElementsAtEvent(e);
								if (0 < activePoints.length) {
									const index = (activePoints[0] as any)._index;
									this.setState({
										CurveIndex: index
									});
								}
							}}
						/>

						<div class="container-center-horizontal">
							<TextComponent
								max={15}
								onInput={(e: any) => {}}
								label={'D1'}
								isEditable={false}
								value={this.GetD1()}
							/>
							<div class="small-right-margin" />
							<TextComponent
								max={15}
								onInput={(e: any) => {}}
								label={'D2'}
								isEditable={false}
								value={this.GetD2()}
							/>
						</div>
						<div class="container-center-horizontal">
							<ButtonComponent
								callBack={() => {
									this.Quit();
								}}
								color={ColorKind.Black}
							>
								<Icon Value="fas fa-undo-alt" /> Quit
							</ButtonComponent>
						</div>
					</div>
				</SmPanelComponent>
			</Redirect>
		);
	}

	private GetD1(): string {
		return this.GetCoo(this._d1);
	}

	private GetD2(): string {
		return this.GetCoo(this._d2);
	}

	private GetCoo(d: RecordData): string {
		if (this.state.CurveIndex === null) {
			return '';
		}
		const unit = d.Hqs.Get(this.state.SelectedHqId).Units.Get(this.state.SelectedUnitId);
		const action = unit.Actions[this.state.CurveIndex];
		if (action !== undefined) {
			const data = action.Amount;
			return `(${[ data.Q, data.R ].toString()})`;
		} else {
			return '';
		}
	}

	private UpdateCurve(unitId: string) {
		if (!this._d1.Hqs.Get(this.state.SelectedHqId).Units.IsEmpty()) {
			const points = this._trackingComparer.GetDelta(this.state.SelectedHqId, unitId);
			const trackingCurve = new DeltaRecordCurve();
			trackingCurve.Points = points;
			trackingCurve.Title = unitId;
			this._chart = this._chartProvider.AttachChart(trackingCurve, this._canvas);
		}
	}

	private GetUnitIds(): string[] {
		if (this.state.SelectedHqId === '') {
			return [];
		}
		return this._d1.Hqs.Get(this.state.SelectedHqId).Units.Keys();
	}
}
