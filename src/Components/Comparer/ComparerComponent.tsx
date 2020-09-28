import { h, Component } from 'preact';
import { route } from 'preact-router';
import { CompChartProvider } from '../Common/CompChartProvider';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import { RecordData } from '../../Core/Framework/Record/RecordData';
import { TrackingComparer } from './Comparers/TrackingComparer';
import PanelComponent from '../Common/Panel/PanelComponent';
import DropDownComponent from '../Common/DropDown/DropDownComponent';
import { TrackingCurve } from './Comparers/TrackingCurve';
import TextComponent from '../Common/Text/TextComponent';

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
	private _trackingComparer: TrackingComparer;
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
	}

	componentDidMount() {
		this._trackingComparer = new TrackingComparer(this._d1, this._d2);
		const hqId = this._d1.Hqs.Keys()[0];
		const unitId = this._d1.Hqs.Get(hqId).Units.Keys()[0];
		this.setState({
			HqIds: this._d1.Hqs.Keys(),
			SelectedHqId: hqId,
			SelectedUnitId: unitId,
			UnitIds: this._d1.Hqs.Get(hqId).Units.Keys()
		});
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
			<PanelComponent>
				<div class="container-center">
					<div class="container-center-horizontal">
						<DropDownComponent
							OnInput={(e: any) => this.setState({ SelectedHqId: e.target.value })}
							Label={'Hq'}
							Values={this.state.HqIds}
						/>
						<DropDownComponent
							OnInput={(e: any) => {
								this.setState({
									SelectedUnitId: e.target.value
								});
							}}
							Label={'Unit'}
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
						<TextComponent onInput={(e: any) => {}} label={'D1'} isEditable={false} value={this.GetD1()} />
						<TextComponent onInput={(e: any) => {}} label={'D2'} isEditable={false} value={this.GetD2()} />
					</div>

					<div class="container-center-horizontal">
						<BlackButtonComponent
							icon={'fas fa-undo-alt'}
							title={'Back'}
							callBack={() => {
								this.Quit();
							}}
						/>
					</div>
				</div>
			</PanelComponent>
		);
	}

	private GetD2(): string {
		if (this.state.CurveIndex === null) {
			return '';
		}
		return this._d2.Hqs
			.Get(this.state.SelectedHqId)
			.Units.Get(this.state.SelectedUnitId)
			.Actions[this.state.CurveIndex].Amount.ToString();
	}

	private GetD1(): string {
		if (this.state.CurveIndex === null) {
			return '';
		}
		return this._d1.Hqs
			.Get(this.state.SelectedHqId)
			.Units.Get(this.state.SelectedUnitId)
			.Actions[this.state.CurveIndex].Amount.ToString();
	}

	private UpdateCurve(unitId: string) {
		const points = this._trackingComparer.GetDelta(this.state.SelectedHqId, unitId);
		const trackingCurve = new TrackingCurve();
		trackingCurve.Points = points;
		trackingCurve.Title = unitId;
		this._chart = this._chartProvider.AttachChart(trackingCurve, this._canvas);
	}

	private GetUnitIds(): string[] {
		if (this.state.SelectedHqId === '') {
			return [];
		}
		return this._d1.Hqs.Get(this.state.SelectedHqId).Units.Keys();
	}
}
