import { Cell } from '../../Items/Cell/Cell';
import { Order } from './Order';
import { OrderKind } from './OrderKind';

export class IdleOrder extends Order {
	GetKind(): OrderKind {
		return OrderKind.None;
	}
	GetPath(): Cell[] {
		return [];
	}
	Update(): void { }
}
