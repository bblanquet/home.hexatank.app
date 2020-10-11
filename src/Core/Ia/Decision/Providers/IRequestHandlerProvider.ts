import { ISimpleRequestHandler } from './../RequestHandler/ISimpleRequestHandler';
import { Groups } from '../../../Utils/Collections/Groups';
export interface IRequestHandlerProvider {
	Get(): Groups<ISimpleRequestHandler>;
}
