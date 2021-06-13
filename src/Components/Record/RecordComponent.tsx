import { IAppService } from '../../Services/App/IAppService';
import { h, Component } from 'preact';
import { route } from 'preact-router';
import UploadButtonComponent from '../Common/Button/Stylish/UploadButtonComponent';
import { RecordData } from '../../Core/Framework/Record/RecordData';
import GridComponent from '../Common/Grid/GridComponent';
import { IRecordService } from '../../Services/Record/IRecordService';
import { ICompareService } from '../../Services/Compare/ICompareService';
import { Singletons, SingletonKey } from '../../Singletons';
import Redirect from '../Redirect/RedirectComponent';
import Icon from '../Common/Icon/IconComponent';
import { RecordSelection } from './RecordSelection';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmButtonComponent from '../Common/Button/Stylish/SmButtonComponent';
import SmPanelComponent from '../Common/Panel/SmPanelComponent';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import SmActiveButtonComponent from '../Common/Button/Stylish/SmActiveButtonComponent';
import Visible from '../Common/Visible/VisibleComponent';
import { GameBlueprint } from '../../Core/Setup/Blueprint/Game/GameBlueprint';

export default class RecordComponent extends Component<
	any,
	{ Records: RecordSelection[]; SelectedRecords: RecordSelection[] }
> {
	private _appService: IAppService<GameBlueprint>;
	private _recordService: IRecordService;
	private _compareService: ICompareService;
	private _playerProfilService: IPlayerProfilService;

	constructor() {
		super();
		this._appService = Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.RecordApp);
		this._playerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._recordService = Singletons.Load<IRecordService>(SingletonKey.Record);
		this._compareService = Singletons.Load<ICompareService>(SingletonKey.Compare);
		const records = this._playerProfilService.GetRecords();
		this.setState({
			Records: records.map((r) => new RecordSelection(false, r)),
			SelectedRecords: []
		});
	}

	private ToHome(): void {
		route('/Home', true);
	}

	private ToCompare(): void {
		this._compareService.Register(this.state.SelectedRecords[0].Record, this.state.SelectedRecords[1].Record);
		route('/Comparer', true);
	}

	private Play(data: RecordData): void {
		this._appService.Register(data.MapContext);
		this._recordService.Register(data);
		route('/RecordCanvas', true);
	}

	private Upload(e: any): void {
		var reader = new FileReader();
		reader.readAsText(e.target.files[0], 'UTF-8');
		reader.onload = (ev: ProgressEvent<FileReader>) => {
			const data = JSON.parse(ev.target.result as string);
			this.state.Records.push(new RecordSelection(false, RecordData.To(data)));
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
				{this.state.Records.map((record) => {
					return (
						<tr class="d-flex">
							<td class="align-self-center">
								<div class="container-center-horizontal">
									<SmActiveButtonComponent
										left={<Icon Value={'fas fa-toggle-off'} />}
										right={<Icon Value={'fas fa-toggle-on'} />}
										leftColor={ColorKind.Red}
										rightColor={ColorKind.Black}
										callBack={() => {
											record.IsSelected = !record.IsSelected;
											this.setState({
												SelectedRecords: this.state.Records.filter((e) => e.IsSelected)
											});
										}}
										isActive={record.IsSelected}
									/>
									<div class="very-small-left-margin" />
									<SmButtonComponent
										callBack={() => this.Play(record.Record)}
										color={ColorKind.Black}
									>
										<Icon Value="fas fa-play-circle" />
									</SmButtonComponent>
									<div class="very-small-left-margin">{record.Record.Title} </div>
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
				<SmPanelComponent>
					<div class="container-center-horizontal">
						<UploadButtonComponent
							icon={'fas fa-upload'}
							title={''}
							callBack={(e: any) => this.Upload(e)}
						/>
						<ButtonComponent
							callBack={() => {
								this.state.SelectedRecords.map((r) => r.Record.Title).forEach((name) => {
									this._playerProfilService.DeleteRecord(name);
								});
								const records = this._playerProfilService.GetRecords();
								this.setState({
									Records: records.map((r) => new RecordSelection(false, r)),
									SelectedRecords: new Array<RecordSelection>()
								});
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-trash" /> {this.state.SelectedRecords.length}
						</ButtonComponent>

						<Visible isVisible={this.state.SelectedRecords.length === 2}>
							<ButtonComponent
								callBack={() => {
									this.ToCompare();
								}}
								color={ColorKind.Red}
							>
								<Icon Value="fas fa-chart-line" />
							</ButtonComponent>
						</Visible>
					</div>

					<GridComponent
						left={this.Header()}
						right={
							this.state.Records && this.state.Records.length === 0 ? (
								this.EmptyGridContent()
							) : (
								this.GridContent()
							)
						}
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
					</div>
				</SmPanelComponent>
			</Redirect>
		);
	}
}
