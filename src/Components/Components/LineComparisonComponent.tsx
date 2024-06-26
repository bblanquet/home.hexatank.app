import { ICompareService } from '../../Services/Compare/ICompareService';
import { h, Component } from 'preact';
import { DeltaLineChart } from '../Common/Chart/Config/DeltaLineChart';
import { RecordComparer } from '../Model/RecordComparer';
import Dropdown from '../Common/Input/Dropdown';
import { DeltaRecordCurve } from '../Model/DeltaRecordCurve';
import { Singletons, SingletonKey } from '../../Singletons';
import Redirect from '../Components/Redirect';
import ChartContainer from '../Common/Chart/ChartContainer';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';

export default class LineComparisonComponent extends Component<
	{},
	{
		HqIds: string[];
		UnitIds: string[];
		SelectedHqId: string;
		SelectedUnitId: string;
		CurveIndex: number | null;
		Canvas: HTMLCanvasElement;
	}
> {
	private _compareService: ICompareService;
	private _recordComparer: RecordComparer;
	private _chartProvider: DeltaLineChart;

	constructor() {
		super();
		this._chartProvider = new DeltaLineChart();
		this.setState({
			HqIds: [],
			UnitIds: [],
			SelectedHqId: '',
			SelectedUnitId: '',
			CurveIndex: null
		});
		this._compareService = Singletons.Load<ICompareService>(SingletonKey.Compare);
	}

	componentWillMount() {
		if (this._compareService) {
			this._recordComparer = this._compareService.Publish();
		}
	}

	componentDidMount() {
		const unitHqs = this._recordComparer.ComparedRecord.Hqs.Keys().filter((hq) => {
			return !this._recordComparer.ComparedRecord.Hqs.Get(hq).Units.IsEmpty();
		});
		const hqId = unitHqs[0];
		const unitId = this._recordComparer.ComparedRecord.Hqs.Get(hqId).Units.Keys()[0];
		this.setState({
			HqIds: unitHqs,
			SelectedHqId: hqId,
			SelectedUnitId: unitId,
			UnitIds: this._recordComparer.ComparedRecord.Hqs.Get(hqId).Units.Keys(),
			Canvas: this.GetCanvas(hqId, unitId)
		});
	}

	render() {
		return (
			<Redirect>
				<div class="container-center-horizontal">
					<div class="statContainer menu-container">
						<div class="container-center">
							<div class="container-center-horizontal">
								<Dropdown
									Color={ColorKind.Black}
									OnInput={(e: any) => {
										const hqId = e.target.value as string;
										const units = this._recordComparer.ComparedRecord.Hqs.Get(hqId).Units;
										const unitId = units.IsEmpty() ? '' : units.Keys()[0];
										this.setState({
											SelectedHqId: hqId,
											SelectedUnitId: unitId,
											Canvas: this.GetCanvas(hqId, unitId)
										});
									}}
									Default={this.state.SelectedHqId}
									Label={'Hq'}
									Values={this.state.HqIds}
								/>
								<div class="small-right-margin" />
								<Dropdown
									Color={ColorKind.Black}
									OnInput={(e: any) => {
										const unitId = e.target.value as string;
										this.setState({
											SelectedUnitId: unitId,
											Canvas: this.GetCanvas(this.state.SelectedHqId, unitId)
										});
									}}
									Label={'Unit'}
									Default={this.state.SelectedUnitId}
									Values={this.GetUnitIds()}
								/>
							</div>

							<ChartContainer canvas={this.state.Canvas} height={40} />
						</div>
					</div>
				</div>
			</Redirect>
		);
	}

	private GetCanvas(hqId: string, unitId: string) {
		if (!this._recordComparer.ComparedRecord.Hqs.Get(hqId).Units.IsEmpty()) {
			const points = this._recordComparer.GetDelta(hqId, unitId);
			const curve = new DeltaRecordCurve();
			curve.Points = points;
			curve.Title = unitId;
			return this._chartProvider.GetCanvas(`${hqId}-${unitId}`, curve);
		} else {
			return null;
		}
	}

	private GetUnitIds(): string[] {
		if (this.state.SelectedHqId === '') {
			return [];
		}
		return this._recordComparer.ComparedRecord.Hqs.Get(this.state.SelectedHqId).Units.Keys();
	}
}
