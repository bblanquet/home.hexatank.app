import { Brain } from '../../Brain';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestId } from '../RequestId';

export interface IGlobalRequestIterator {
	GetResquest(kingdom: Brain): AreaRequest[];
	GetIds(): RequestId[];
}
