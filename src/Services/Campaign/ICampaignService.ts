import { CampaignKind } from './CampaignKind';

export interface ICampaignService {
	GetMapContext(kind: CampaignKind, index: number): any;
	GetButtons(kind: CampaignKind): Array<boolean>;
}
