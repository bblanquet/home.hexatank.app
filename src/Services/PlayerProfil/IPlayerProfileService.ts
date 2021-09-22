import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { CampaignKind } from '../Campaign/CampaignKind';
import { PlayerDetails } from './PlayerDetails';
import { PlayerProfile } from './PlayerProfile';
import { PointDetails } from './PointDetails';

export interface IPlayerProfileService {
	SetProfile(model: PlayerProfile): void;
	GetProfile(): PlayerProfile;

	Save(): void;
	Load(): void;
	Clear(): void;

	HasToken(): boolean;
	SetToken(name: string, token: string): void;

	AddHistory(record: JsonRecordContent): void;
	DeleteHistory(name: string): void;
	GetHistory(): RecordContent[];

	SetStage(kind: CampaignKind, stage: number): void;
	SetDetails(detail: PlayerDetails): void;

	GetPoints(): number;
	AddPoints(points: number): void;
	OnPointsAdded: LiteEvent<PointDetails>;
	OnUpdated: SimpleEvent;
}
