import { Groups } from '../../../../Utils/Collections/Groups';
import { RequestId } from '../Requests/RequestId';
import { AreaRequest } from '../Utils/AreaRequest';

export interface IHandlerIterator {
	Exist(id: RequestId): boolean;
	Iterate(requests: Groups<AreaRequest>): void;
}
