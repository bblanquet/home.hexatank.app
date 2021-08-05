import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IPlayerProfileService } from './IPlayerProfileService';
import { PlayerProfile } from './PlayerProfile';
import { PointDetails } from './PointDetails';

export class PlayerProfilService implements IPlayerProfileService {
	private _key: string = 'program6';
	private _profil: PlayerProfile;
	public OnPointsAdded: LiteEvent<PointDetails> = new LiteEvent<PointDetails>();

	constructor() {
		this.Load();
	}

	GetPoints(): number {
		return this._profil.Points;
	}

	SetProfil(profil: PlayerProfile): void {
		this._profil = profil;
		this.Save();
	}

	GetProfil(): PlayerProfile {
		if (!this._profil) {
			this.Load();
		}
		return this._profil;
	}

	public Load(): void {
		let profil: PlayerProfile = null;
		const blob = window.localStorage.getItem(this._key);
		const parsedProfil = JSON.parse(blob as string);
		if (parsedProfil && (parsedProfil as PlayerProfile).Version === PlayerProfile.Version) {
			profil = parsedProfil as PlayerProfile;
		} else {
			profil = new PlayerProfile();
		}
		this.SetProfil(profil);
	}

	public GetRecords(): RecordContent[] {
		const p = this.GetProfil();
		const result: RecordContent[] = [];
		if (p.Records) {
			p.Records.forEach((jsonRecord) => {
				result.push(RecordContent.To(jsonRecord));
			});
		}
		return result;
	}

	Save(): void {
		window.localStorage.setItem(this._key, JSON.stringify(this._profil));
	}

	DeleteRecord(name: string): void {
		this._profil.Records = this._profil.Records.filter((r) => r.Title !== name);
		this.Save();
	}

	AddPoints(points: number): void {
		this.OnPointsAdded.Invoke(this, new PointDetails(this.GetPoints(), points));
		this._profil.Points += points;
	}
}
