import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { PlayerProfil } from './PlayerProfil';
import { PointDetails } from './PointDetails';

export interface IPlayerProfilService {
	SetProfil(model: PlayerProfil): void;
	GetProfil(): PlayerProfil;
	Save(): void;
	Load(): void;

	DeleteRecord(name: string): void;
	GetRecords(): RecordContent[];

	GetPoints(): number;
	AddPoints(points: number): void;
	OnPointsAdded: LiteEvent<PointDetails>;
}
