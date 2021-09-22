import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { CampaignKind } from '../Campaign/CampaignKind';
import { PlayerProfile } from './PlayerProfile';
import { PointDetails } from './PointDetails';

export interface IPlayerProfileService {
	SetProfile(model: PlayerProfile): void;
	GetProfile(): PlayerProfile;

	HasToken(): boolean;
	Save(): void;
	Load(): void;
	Clear(): void;

	AddHistory(record: JsonRecordContent): void;
	DeleteHistory(name: string): void;
	GetHistory(): RecordContent[];

	SetStage(kind: CampaignKind, stage: number): void;

	GetPoints(): number;
	AddPoints(points: number): void;
	OnPointsAdded: LiteEvent<PointDetails>;
}
