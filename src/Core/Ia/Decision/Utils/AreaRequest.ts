import { RequestType } from './RequestType';
import { BrainArea } from './BrainArea';

export class AreaRequest {
	public constructor(public RequestType: RequestType, public Priority: string, public Area: BrainArea) {}
}
