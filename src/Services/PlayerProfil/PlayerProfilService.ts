import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IPlayerProfilService } from './IPlayerProfilService';
import { PlayerProfil } from './PlayerProfil';
import { PointDetails } from './PointDetails';

export class PlayerProfilService implements IPlayerProfilService {
	private _key: string = 'program6';
	private _profil: PlayerProfil;
	public OnPointsAdded: LiteEvent<PointDetails> = new LiteEvent<PointDetails>();

	constructor() {
		this.Load();
	}

	GetPoints(): number {
		return this._profil.Points;
	}

	SetProfil(profil: PlayerProfil): void {
		this._profil = profil;
		this.Save();
	}

	GetProfil(): PlayerProfil {
		if (!this._profil) {
			this.Load();
		}
		return this._profil;
	}

	public Load(): void {
		let profil: PlayerProfil = null;
		const blob = window.localStorage.getItem(this._key);
		const parsedProfil = JSON.parse(blob as string);
		if (parsedProfil && (parsedProfil as PlayerProfil).Version === PlayerProfil.Version) {
			profil = parsedProfil as PlayerProfil;
		} else {
			profil = new PlayerProfil();
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
