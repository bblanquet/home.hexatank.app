import { CampaignKind } from './CampaignKind';
import { StageState } from './StageState';

export interface ICampaignService {
	GetBlueprint(kind: CampaignKind, index: number): any;
	GetStages(kind: CampaignKind): StageState[];
}
