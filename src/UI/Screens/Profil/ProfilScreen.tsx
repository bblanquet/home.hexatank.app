import { h, Component } from 'preact';
import { route } from 'preact-router';
import { GameBlueprint } from '../../../Core/Framework/Blueprint/Game/GameBlueprint';
import { JsonRecordContent } from '../../../Core/Framework/Record/Model/JsonRecordContent';
import { RecordContent } from '../../../Core/Framework/Record/Model/RecordContent';
import { IAppService } from '../../../Services/App/IAppService';
import { ICompareService } from '../../../Services/Compare/ICompareService';
import { IPlayerProfilService } from '../../../Services/PlayerProfil/IPlayerProfilService';
import { IRecordService } from '../../../Services/Record/IRecordService';
import { Singletons, SingletonKey } from '../../../Singletons';
import ButtonComponent from '../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../../Common/Button/Stylish/SmActiveButtonComponent';
import SmButtonComponent from '../../Common/Button/Stylish/SmButtonComponent';
import UploadButtonComponent from '../../Common/Button/Stylish/UploadButtonComponent';
import GridComponent from '../../Common/Grid/GridComponent';
import Icon from '../../Common/Icon/IconComponent';
import SmPanelComponent from '../../Components/Panel/SmPanelComponent';
import Redirect from '../../Components/Redirect';
import Switch from '../../Components/Switch';
import Visible from '../../Components/Visible';
import { RecordSelection } from './RecordSelection';

export default class ProfilScreen extends Component<
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
		route('{{sub_path}}Home', true);
	}

	private ToCompare(): void {
		this._compareService.Register(this.state.SelectedRecords[0].Record, this.state.SelectedRecords[1].Record);
		route('{{sub_path}}Comparison', true);
	}

	private Play(data: RecordContent): void {
		this._appService.Register(data.Blueprint);
		this._recordService.Register(data);
		route('{{sub_path}}Player', true);
	}

	private Upload(e: any): void {
		var reader = new FileReader();
		if (e.target.files && 0 < e.target.files.length) {
			reader.readAsText(e.target.files[0], 'UTF-8');
			reader.onload = (ev: ProgressEvent<FileReader>) => {
				const data = JSON.parse(ev.target.result as string);
				const record = RecordContent.To(data);
				this._playerProfilService.GetProfil().Records.push(JsonRecordContent.To(record, false));
				this.state.Records.push(new RecordSelection(false, record));
				this.setState({
					Records: this.state.Records
				});
			};
		}
	}

	private Download(): void {
		const url = document.createElement('a');
		const file = new Blob([ JSON.stringify(JsonRecordContent.To(this.state.SelectedRecords[0].Record, false)) ], {
			type: 'application/json'
		});
		url.href = URL.createObjectURL(file);
		url.download = `${this.state.SelectedRecords[0].Record.Title}.json`;
		url.click();
		URL.revokeObjectURL(url.href);
	}

	private Header() {
		return (
			<thead>
				<tr class="d-flex">
					<th>
						Last games {this.state.Records.filter((e) => e.Record.IsVictory).length} {this.VictoryIcon()} /{' '}
						{this.state.Records.filter((e) => !e.Record.IsVictory).length} {this.DefeatIcon()}
					</th>
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
									<div class="very-small-left-margin">
										<Switch
											isVisible={record.Record.IsVictory}
											left={this.VictoryIcon()}
											right={this.DefeatIcon()}
										/>{' '}
										{record.Record.Title}
									</div>
								</div>
							</td>
						</tr>
					);
				})}
			</tbody>
		);
	}

	private DefeatIcon(): any {
		return (
			<span style="color:#d93232">
				<Icon Value={'fas fa-minus-square'} />
			</span>
		);
	}

	private VictoryIcon(): any {
		return (
			<span style="color:#8fe336">
				<Icon Value={'fas fa-plus-square'} />
			</span>
		);
	}

	render() {
		return (
			<Redirect>
				<SmPanelComponent>
					<div class="container-center-horizontal">
						<UploadButtonComponent
							icon={'fas fa-file-upload'}
							title={''}
							callBack={(e: any) => this.Upload(e)}
						/>
						<Visible isVisible={this.state.SelectedRecords.length === 1}>
							<ButtonComponent callBack={() => this.Download()} color={ColorKind.Green}>
								<Icon Value="fas fa-file-download" />
							</ButtonComponent>
						</Visible>
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
								<Icon Value="fas fa-not-equal" />
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
