import { OrderKind } from '../../Ia/Order/OrderKind';

export class OrderPacket {
	public Id: string;
	public Coos: string[];
	public Kind: OrderKind;
}
