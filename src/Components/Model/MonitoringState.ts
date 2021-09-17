import { ErrorDetail } from './ErrorDetail';
import { RequestState } from './RequestState';

export class MonitoringState {
	Errors: ErrorDetail[] = [];
	State: RequestState;
}
