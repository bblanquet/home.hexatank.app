import { RecordData } from '../../Core/Framework/Record/RecordData';
import { SimpleEvent } from '../../Core/Utils/Events/SimpleEvent';
import { IPlayerProfilService } from './IPlayerProfilService';
import { PlayerProfil } from './PlayerProfil';

export class PlayerProfilService implements IPlayerProfilService {
	private _key: string = 'program6';
	private _profil: PlayerProfil;
	private _colors: string[] = ['#fcba03', '#5cd1ff', '#f54ce1', '#f53361', '#6beb4b', '#5571ed', '#ed8f55'];
	public OnPointChanged: SimpleEvent = new SimpleEvent();
	public OnLevelUp: SimpleEvent = new SimpleEvent();

	constructor() {
		this.Init();
	}

	AddPoint(point: number): number {
		const previousLevel = this.GetLevel();
		this._profil.Points += point;
		this.OnPointChanged.Invoke();
		if (previousLevel < this.GetLevel()) {
			this.OnLevelUp.Invoke();
		}
		return this._profil.Points;
	}

	SetProfil(profil: PlayerProfil): void {
		this._profil = profil;
		this.Update();
	}

	GetProfil(): PlayerProfil {
		if (!this._profil) {
			this.Init();
		}
		return this._profil;

	}

	public Init(): void {
		let profil: PlayerProfil = null;
		const blob = window.localStorage.getItem(this._key);
		const parsedProfil = JSON.parse(blob as string);
		if (parsedProfil) {
			profil = parsedProfil as PlayerProfil;
		} else {
			profil = new PlayerProfil();
		}
		this.SetProfil(profil);
	}

	public GetRecords(): RecordData[] {
		const p = this.GetProfil();
		const result: RecordData[] = [];
		if (p.Records) {
			p.Records.forEach((r) => {
				result.push(RecordData.To(r));
			});
		}
		return result;
	}

	GetLevel(): number {
		return Math.trunc(this._profil.Points / 50);
	}
	GetNextLevelPercentage(): number {
		const percentage = (this._profil.Points % 50) * 2;
		return percentage;
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
