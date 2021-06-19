import { ICompareService } from '../../Services/Compare/ICompareService';
import { h, Component } from 'preact';
import { route } from 'preact-router';
import { DeltaLineChart } from '../Common/Chart/Config/DeltaLineChart';
import { RecordComparer } from './Comparers/RecordComparer';
import DropDownComponent from '../Common/DropDown/DropDownComponent';
import { DeltaRecordCurve } from './Comparers/DeltaRecordCurve';
import { Singletons, SingletonKey } from '../../Singletons';
import Redirect from '../Redirect/RedirectComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import SmPanelComponent from '../Common/Panel/SmPanelComponent';
import ChartContainer from '../Common/Chart/ChartContainer';

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

	private Quit(): void {
		route('/Home', true);
	}

	render() {
		return (
			<Redirect>
				<SmPanelComponent>
					<div class="statContainer container-center-horizontal menu-container">
						<div class="container-center">
							<div class="container-center-horizontal">
								<DropDownComponent
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
									DefaultValue={this.state.SelectedHqId}
									Label={'Hq'}
									Values={this.state.HqIds}
								/>
								<div class="small-right-margin" />
								<DropDownComponent
									OnInput={(e: any) => {
										const unitId = e.target.value as string;
										this.setState({
											SelectedUnitId: unitId,
											Canvas: this.GetCanvas(this.state.SelectedHqId, unitId)
										});
									}}
									Label={'Unit'}
									DefaultValue={this.state.SelectedUnitId}
									Values={this.GetUnitIds()}
								/>
							</div>

							<ChartContainer canvas={this.state.Canvas} height={40} />
							<div class="container-center-horizontal">
								<ButtonComponent
									callBack={() => {
										this.Quit();
									}}
									color={ColorKind.Black}
								>
									<Icon Value="fas fa-undo-alt" /> Quit
								</ButtonComponent>
								<ButtonComponent
									callBack={() => {
										route('/BarComparison', true);
									}}
									color={ColorKind.Blue}
								>
									<Icon Value="fas fa-chart-bar" /> Comparison
								</ButtonComponent>
							</div>
						</div>
					</div>
				</SmPanelComponent>
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
