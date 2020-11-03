import { MapContext } from '../../Core/Setup/Generator/MapContext';
import { CampaignKind } from './CampaignKind';

export interface ICampaignService {
	GetMapContext(kind: CampaignKind, index: number): MapContext;
	GetButtons(kind: CampaignKind): Array<boolean>;
}
