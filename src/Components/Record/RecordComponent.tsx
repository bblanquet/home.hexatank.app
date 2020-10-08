import { IAppService } from '../../Services/App/IAppService';
import { h, Component } from 'preact';
import { route } from 'preact-router';
import PanelComponent from '../Common/Panel/PanelComponent';
import UploadButtonComponent from '../Common/Button/Stylish/UploadButtonComponent';
import { RecordObject } from '../../Core/Framework/Record/RecordObject';
import { RecordHq } from '../../Core/Framework/Record/RecordHq';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { RecordUnit } from '../../Core/Framework/Record/RecordUnit';
import { RecordData } from '../../Core/Framework/Record/RecordData';
import { RecordCell } from '../../Core/Framework/Record/RecordCell';
import GridComponent from '../Common/Grid/GridComponent';
import { IRecordService } from '../../Services/Record/IRecordService';
import { ICompareService } from '../../Services/Compare/ICompareService';
import { Factory, FactoryKey } from '../../Factory';
import Redirect from '../Redirect/RedirectComponent';
import Icon from '../Common/Icon/IconComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmButtonComponent from '../Common/Button/Stylish/SmButtonComponent';

export default class RecordComponent extends Component<any, { Records: RecordObject[] }> {
	private _appService: IAppService;
	private _recordService: IRecordService;
	private _compareService: ICompareService;

	constructor() {
		super();
		this._appService = Factory.Load<IAppService>(FactoryKey.RecordApp);
		this._recordService = Factory.Load<IRecordService>(FactoryKey.Record);
		this._compareService = Factory.Load<ICompareService>(FactoryKey.Compare);
		this.setState({
			Records: []
		});
	}

	private ToHome(): void {
		route('/Home', true);
	}

	private ToCompare(): void {
		const record = this.ToTracking(this.state.Records[0]);
		const compare = this.ToTracking(this.state.Records[1]);
		this._compareService.Register(record, compare);
		route('/Comparer', true);
	}

	private Play(data: RecordObject): void {
		const record = this.ToTracking(data);
		this._appService.Register(data.MapContext);
		this._recordService.Register(record);

		route('/RecordCanvas', true);
	}

	public ToTracking(e: RecordObject): RecordData {
		const hqs = new Dictionnary<RecordHq>();
		hqs.SetValues(e.Hqs);

		hqs.Values().forEach((hq) => {
			const units = hq.Units as any;
			hq.Units = new Dictionnary<RecordUnit>();
			hq.Units.SetValues(units);
		});

		const cells = new Dictionnary<RecordCell>();
		cells.SetValues(e.Cells);

		const result = new RecordData();
		result.Hqs = hqs;
		result.Cells = cells;
		result.Dates = e.Points;
		return result;
	}

	private Upload(e: any): void {
		var reader = new FileReader();
		reader.readAsText(e.target.files[0], 'UTF-8');
		reader.onload = (ev: ProgressEvent<FileReader>) => {
			const context = JSON.parse(ev.target.result as string);
			this.state.Records.push(context);
			this.setState({
				Records: this.state.Records
			});
		};
	}

	private Header() {
		return (
			<thead>
				<tr class="d-flex">
					<th>Records</th>
				</tr>
			</thead>
		);
	}

	private EmptyGridContent() {
		return (
			<tbody>
				<tr class="d-flex">
					<td class="align-self-center">No record available...</td>
				</tr>
			</tbody>
		);
	}

	private GridContent() {
		return (
			<tbody>
				{this.state.Records.map((data, i) => {
					return (
						<tr class="d-flex">
							<td class="align-self-center">{data}</td>
							<td class="align-self-center">
								<div class="container-center-horizontal">
									<div class="small-right-margin">{data.Title} </div>
									<SmButtonComponent callBack={() => this.Play(data)} color={ColorKind.Black}>
										<Icon Value="fas fa-play-circle" />
									</SmButtonComponent>
								</div>
							</td>
						</tr>
					);
				})}
			</tbody>
		);
	}

	render() {
		return (
			<Redirect>
				<PanelComponent>
					<div class="container-center-horizontal">
						<ButtonComponent
							callBack={() => {
								this.setState({
									Records: []
								});
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-trash" /> Clear
						</ButtonComponent>

						<UploadButtonComponent
							icon={'fas fa-upload'}
							title={'Upload'}
							callBack={(e: any) => this.Upload(e)}
						/>
					</div>

					<GridComponent
						left={this.Header()}
						right={this.state.Records.length === 0 ? this.EmptyGridContent() : this.GridContent()}
					/>

					<div class="container-center-horizontal">
						<ButtonComponent
							callBack={() => {
								this.ToHome();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</ButtonComponent>
						{this.state.Records.length === 2 ? (
							<ButtonComponent
								callBack={() => {
									this.ToCompare();
								}}
								color={ColorKind.Red}
							>
								<Icon Value="fas fa-chart-line" /> Compare
							</ButtonComponent>
						) : (
							''
						)}
					</div>
				</PanelComponent>
			</Redirect>
		);
	}
}
