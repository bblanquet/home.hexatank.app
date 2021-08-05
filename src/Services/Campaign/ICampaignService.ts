import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';
import { CampaignKind } from './CampaignKind';
import { StageState } from './StageState';

export interface ICampaignService {
	GetBlueprint(kind: CampaignKind, index: number): IBlueprint;
	GetStages(kind: CampaignKind): StageState[];
}
