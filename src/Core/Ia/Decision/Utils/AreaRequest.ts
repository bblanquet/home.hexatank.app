import { RequestType } from './RequestType';
import { KingdomArea } from './KingdomArea';
import { RequestPriority } from './RequestPriority';

export class AreaRequest {
	public constructor(
		public RequestType: RequestType,
		public Priority: RequestPriority,
		public RequestCount: number,
		public Area: KingdomArea
	) {}
}
