import { h, Component } from 'preact';
import { route } from 'preact-router';
import PanelComponent from '../Common/Panel/PanelComponent';
import UploadButtonComponent from '../Common/Button/Stylish/UploadButtonComponent';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { RecordObject } from '../../Core/Framework/Record/RecordObject';
import { RecordHq } from '../../Core/Framework/Record/RecordHq';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { RecordUnit } from '../../Core/Framework/Record/RecordUnit';
import { RecordData } from '../../Core/Framework/Record/RecordData';
import { RecordCell } from '../../Core/Framework/Record/RecordCell';
import SmBlackButtonComponent from '../Common/Button/Stylish/SmBlackButtonComponent';
import GridComponent from '../Common/Grid/GridComponent';
export default class RecordComponent extends Component<any, { Records: RecordObject[] }> {
	constructor() {
		super();
		this.setState({
			Records: []
		});
	}

	private ToHome(): void {
		route('/Home', true);
	}

	private Play(data: RecordObject): void {
		GameHelper.TackingDatas = this.ToTracking(data);
		GameHelper.MapContext = data.MapContext;
		route('/LightCanvas', true);
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

	componentDidMount() {}

	componentWillUnmount() {}

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
									<SmBlackButtonComponent title={`Play`} callBack={() => this.Play(data)} />
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
			<PanelComponent>
				<div class="container-center-horizontal">
					<BlackButtonComponent
						icon={'fas fa-trash'}
						title={'Clear'}
						callBack={() => {
							this.setState({
								Records: []
							});
						}}
					/>
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
					<BlackButtonComponent
						icon={'fas fa-undo-alt'}
						title={'Back'}
						callBack={() => {
							this.ToHome();
						}}
					/>
					{this.state.Records.length === 2 ? (
						<RedButtonComponent
							icon={'fas fa-chart-line'}
							title={'Compare'}
							callBack={() => {
								this.ToHome();
							}}
						/>
					) : (
						''
					)}
				</div>
			</PanelComponent>
		);
	}
}
