import { RequestType } from './RequestType';
import { IaArea } from './IaArea';
import { RequestPriority } from './RequestPriority';

export class AreaRequest {
	public constructor(
		public RequestType: RequestType,
		public Priority: RequestPriority,
		public RequestCount: number,
		public Area: IaArea
	) {}
}
