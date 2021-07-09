import { Hook } from './Hook';
import { ProfilState } from '../Model/ProfilState';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IAppService } from '../../Services/App/IAppService';
import { StateUpdater } from 'preact/hooks';
import { Singletons, SingletonKey } from '../../Singletons';
import { RecordSelection } from '../Model/RecordSelection';
import { IRecordService } from '../../Services/Record/IRecordService';
import { ICompareService } from '../../Services/Compare/ICompareService';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { route } from 'preact-router';
import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';

export class ProfilHook extends Hook<ProfilState> {
	private _appService: IAppService<GameBlueprint>;
	private _recordService: IRecordService;
	private _compareService: ICompareService;
	private _playerProfilService: IPlayerProfilService;

	constructor(d: [ProfilState, StateUpdater<ProfilState>]) {
		super(d[0], d[1]);
		this._appService = Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.RecordApp);
		this._playerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._recordService = Singletons.Load<IRecordService>(SingletonKey.Record);
		this._compareService = Singletons.Load<ICompareService>(SingletonKey.Compare);
	}

	public static DefaultState(): ProfilState {
		const state = new ProfilState();
		const playerProfilSvc = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		const records = playerProfilSvc.GetRecords();
		state.Records = records.map((r) => new RecordSelection(false, r));
		state.SelectedRecords = [];
		return state;
	}

	public ToHome(): void {
		route('{{sub_path}}Home', true);
	}

	public ToCompare(): void {
		this._compareService.Register(this.State.SelectedRecords[0].Record, this.State.SelectedRecords[1].Record);
		route('{{sub_path}}Comparison', true);
	}

	public Play(data: RecordContent): void {
		this._appService.Register(data.Blueprint, () => {}, () => {});
		this._recordService.Register(data);
		route('{{sub_path}}Player', true);
	}

	public Select(data: RecordSelection): void {
		data.IsSelected = !data.IsSelected;
		this.SetProp((e) => (e.SelectedRecords = this.State.Records.filter((e) => e.IsSelected)));
	}

	public Delete(): void {
		this.State.SelectedRecords.map((r) => r.Record.Title).forEach((name) => {
			this._playerProfilService.DeleteRecord(name);
		});
		const records = this._playerProfilService.GetRecords();
		this.SetProp((e) => {
			(e.Records = records.map((r) => new RecordSelection(false, r))),
				(e.SelectedRecords = new Array<RecordSelection>());
		});
	}

	public Upload(e: any): void {
		var reader = new FileReader();
		if (e.target.files && 0 < e.target.files.length) {
			reader.readAsText(e.target.files[0], 'UTF-8');
			reader.onload = (ev: ProgressEvent<FileReader>) => {
				const data = JSON.parse(ev.target.result as string);
				const record = RecordContent.To(data);
				this._playerProfilService.GetProfil().Records.push(JsonRecordContent.To(record, false));
				this.SetProp((e) => e.Records.push(new RecordSelection(false, record)));
			};
		}
	}

	public Download(): void {
		const url = document.createElement('a');
		const file = new Blob([ JSON.stringify(JsonRecordContent.To(this.State.SelectedRecords[0].Record, false)) ], {
			type: 'application/json'
		});
		url.href = URL.createObjectURL(file);
		url.download = `${this.State.SelectedRecords[0].Record.Title}.json`;
		url.click();
		URL.revokeObjectURL(url.href);
	}

	public Unmount(): void {}
}
