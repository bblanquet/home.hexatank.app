import { RecordData } from '../../Core/Framework/Record/RecordData';
import { SimpleEvent } from '../../Core/Utils/Events/SimpleEvent';
import { IPlayerProfilService } from './IPlayerProfilService';
import { PlayerProfil } from './PlayerProfil';

export class PlayerProfilService implements IPlayerProfilService {
	private _key: string = 'program6';
	private _profil: PlayerProfil;
	private _colors: string[] = [ '#fcba03', '#5cd1ff', '#f54ce1', '#f53361', '#6beb4b', '#5571ed', '#ed8f55' ];
	public OnPointChanged: SimpleEvent = new SimpleEvent();

	constructor() {}

	AddPoint(point: number): void {
		this._profil.Points += point;
		this.OnPointChanged.Invoke();
	}

	SetProfil(profil: PlayerProfil): void {
		this._profil = profil;
		this.Update();
	}

	GetProfil(): PlayerProfil {
		if (this._profil) {
			return this._profil;
		} else {
			let profil: PlayerProfil = null;
			const blob = window.localStorage.getItem(this._key);
			const parsedProfil = JSON.parse(blob as string);
			if (parsedProfil) {
				profil = parsedProfil as PlayerProfil;
			} else {
				profil = new PlayerProfil();
			}
			this.SetProfil(profil);

			return profil;
		}
	}

	public GetRecords(): RecordData[] {
		const p = this.GetProfil();
		const result: RecordData[] = [];
		if (p.Records) {
			console.log('format');
			p.Records.forEach((r) => {
				result.push(RecordData.To(r));
			});
		}
		return result;
	}

	GetLevel(): number {
		return Math.round(this._profil.Points / 50);
	}
	GetNextLevelPercentage(): number {
		return (this._profil.Points % 50) / 50 * 100;
	}

	GetColorLevel(): string {
		const size = this.GetLevel() % this._colors.length;
		return this._colors[size];
	}

	Update(): void {
		window.localStorage.setItem(this._key, JSON.stringify(this._profil));
	}

	DeleteRecord(name: string): void {
		this._profil.Records = this._profil.Records.filter((r) => r.Title !== name);
		this.Update();
	}
}
