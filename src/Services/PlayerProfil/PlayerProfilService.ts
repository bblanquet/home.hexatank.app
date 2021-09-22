import axios from 'axios';
import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { CampaignKind } from '../Campaign/CampaignKind';
import { IPlayerProfileService } from './IPlayerProfileService';
import { PlayerDetails } from './PlayerDetails';
import { PlayerProfile } from './PlayerProfile';
import { PointDetails } from './PointDetails';

export class PlayerProfilService implements IPlayerProfileService {
	private _key: string = 'program6';
	private _profile: PlayerProfile;
	public OnPointsAdded: LiteEvent<PointDetails> = new LiteEvent<PointDetails>();

	constructor() {
		this.Load();
	}

	public Clear(): void {
		this._profile.Details = new PlayerDetails();
		this._profile.Token = '';
		this.Save();
	}

	public SetProfile(profil: PlayerProfile): void {
		this._profile = profil;
		this.Save();
	}

	public GetProfile(): PlayerProfile {
		if (!this._profile) {
			this.Load();
		}
		return this._profile;
	}

	public Load(): void {
		let profil: PlayerProfile = null;
		const persistentProfile = JSON.parse(window.localStorage.getItem(this._key) as string);
		if (this.IsSync(persistentProfile)) {
			profil = persistentProfile as PlayerProfile;
		} else {
			profil = new PlayerProfile();
		}
		this.SetProfile(profil);
	}

	public Save(): void {
		window.localStorage.setItem(this._key, JSON.stringify(this._profile));
	}

	private Update(): void {
		if (this.HasToken()) {
			try {
				axios.post('{{server}}/Player/update', this._profile.Details, {
					headers: {
						Authorization: `Bearer ${this._profile.Token}`
					}
				});
			} catch (error) {}
		}
	}

	public HasToken(): boolean {
		return this._profile.Token !== undefined && this._profile.Token !== '';
	}

	public IsSync(p: PlayerProfile): boolean {
		return p && p.CurrentVersion && p.CurrentVersion === PlayerProfile.Version;
	}

	public AddHistory(record: JsonRecordContent): void {
		this._profile.History.push(record);
	}

	public DeleteHistory(name: string): void {
		this._profile.History = this._profile.History.filter((r) => r.Title !== name);
		this.Save();
	}

	public GetHistory(): RecordContent[] {
		const p = this.GetProfile();
		const result: RecordContent[] = [];
		if (p.History) {
			p.History.forEach((jsonRecord) => {
				result.push(RecordContent.To(jsonRecord));
			});
		}
		return result;
	}

	public SetStage(kind: CampaignKind, stage: number): void {
		if (kind === CampaignKind.blue && this._profile.Details.blue < stage) {
			this._profile.Details.blue = stage;
		} else if (kind === CampaignKind.red && this._profile.Details.red < stage) {
			this._profile.Details.red = stage;
		} else if (kind === CampaignKind.green && this._profile.Details.green < stage) {
			this._profile.Details.green = stage;
		}
		this.Update();
	}

	public AddPoints(points: number): void {
		this.OnPointsAdded.Invoke(this, new PointDetails(this.GetPoints(), points));
		this._profile.Details.score += points;
		this.Update();
	}

	public GetPoints(): number {
		return this._profile.Details.score;
	}
}
