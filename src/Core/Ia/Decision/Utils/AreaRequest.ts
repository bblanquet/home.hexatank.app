import { RequestType } from './RequestType';
import { IaArea } from './IaArea';

export class AreaRequest {
	public constructor(public RequestType: RequestType, public Priority: string, public Area: IaArea) {}
}
