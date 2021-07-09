import { CampaignKind } from './CampaignKind';
import { StageState } from './StageState';

export interface ICampaignService {
	GetMapContext(kind: CampaignKind, index: number): any;
	GetStages(kind: CampaignKind): StageState[];
}
