import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { PlayerProfile } from './PlayerProfile';
import { PointDetails } from './PointDetails';

export interface IPlayerProfileService {
	SetProfil(model: PlayerProfile): void;
	GetProfil(): PlayerProfile;
	Save(): void;
	Load(): void;

	DeleteRecord(name: string): void;
	GetRecords(): RecordContent[];

	GetPoints(): number;
	AddPoints(points: number): void;
	OnPointsAdded: LiteEvent<PointDetails>;
}
