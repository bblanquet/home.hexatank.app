import { Hook } from './Hook';
import { ProfileState } from '../Model/ProfileState';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IBuilder } from '../../Services/Builder/IBuilder';
import { StateUpdater } from 'preact/hooks';
import { Singletons, SingletonKey } from '../../Singletons';
import { RecordSelection } from '../Model/RecordSelection';
import { IRecordService } from '../../Services/Record/IRecordService';
import { ICompareService } from '../../Services/Compare/ICompareService';
import { IPlayerProfileService } from '../../Services/PlayerProfil/IPlayerProfileService';
import { route } from 'preact-router';
import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { BrainKind } from '../../Core/Ia/Decision/BrainKind';

export class ProfileHook extends Hook<ProfileState> {
	private _appService: IBuilder<GameBlueprint>;
	private _recordService: IRecordService;
	private _compareService: ICompareService;
	private _playerProfilService: IPlayerProfileService;

	constructor(d: [ProfileState, StateUpdater<ProfileState>]) {
		super(d[0], d[1]);
		this._appService = Singletons.Load<IBuilder<GameBlueprint>>(SingletonKey.PlayerBuilder);
		this._playerProfilService = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		this._recordService = Singletons.Load<IRecordService>(SingletonKey.Record);
		this._compareService = Singletons.Load<ICompareService>(SingletonKey.Compare);
	}

	public static DefaultState(): ProfileState {
		const state = new ProfileState();
		const playerProfilSvc = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
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
		data.Blueprint.Hqs.forEach((hq) => {
			hq.Player.IA = BrainKind.Dummy;
		});
		this._appService.Register(data.Blueprint, () => {}, () => {});
		this._recordService.Register(data);
		route('{{sub_path}}Player', true);
	}

	public Select(data: RecordSelection): void {
		data.IsSelected = !data.IsSelected;
		this.Update((e) => (e.SelectedRecords = this.State.Records.filter((e) => e.IsSelected)));
	}

	public Delete(): void {
		this.State.SelectedRecords.map((r) => r.Record.Title).forEach((name) => {
			this._playerProfilService.DeleteRecord(name);
		});
		const records = this._playerProfilService.GetRecords();
		this.Update((e) => {
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
				this.Update((e) => e.Records.push(new RecordSelection(false, record)));
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
