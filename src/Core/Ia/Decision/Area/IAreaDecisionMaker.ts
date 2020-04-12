import { KingdomArea } from './../Utils/KingdomArea';

export interface IAreaDecisionMaker {
	Update(): void;
	Area: KingdomArea;
	HasReceivedRequest: boolean;
}
