import { RecordData } from '../../Core/Framework/Record/RecordData';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
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
	Init(): void;
	GetPoints(): number;
	AddPoints(points: number): void;
	OnPointChanged: LiteEvent<number>;
	OnLevelUp: SimpleEvent;
}
