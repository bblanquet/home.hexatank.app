import { RecordData } from '../../Core/Framework/Record/RecordData';
import { SimpleEvent } from './../../Core/Utils/Events/SimpleEvent';
import { PlayerProfil } from './PlayerProfil';

export interface IPlayerProfilService {
	DeleteRecord(name: string): void;
	SetProfil(model: PlayerProfil): void;
	GetProfil(): PlayerProfil;
	GetRecords(): RecordData[];
	GetLevel(): number;
	GetNextLevelPercentage(): number;
	GetColorLevel(): string;
	Update(): void;
	AddPoint(point: number): void;
	OnPointChanged: SimpleEvent;
}
