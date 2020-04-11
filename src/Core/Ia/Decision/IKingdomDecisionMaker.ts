import { Diamond } from './../../Items/Cell/Field/Diamond';
import { KingdomArea } from './Utils/KingdomArea';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
export interface IKingdomDecisionMaker {
	GetKingdomAreas(): Dictionnary<KingdomArea>;
	GetDiamond(): Diamond;
}
