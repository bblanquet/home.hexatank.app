import { Groups } from '../../../../Utils/Collections/Groups';
import { AreaRequest } from '../Utils/AreaRequest';

export interface IRequestHandler {
	HandleRequests(requests: Groups<AreaRequest>): void;
}
