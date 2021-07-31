import { RequestType } from '../Utils/RequestType';

export class RequestId {
	constructor(public Type: RequestType, public Priority: number) {}
}
