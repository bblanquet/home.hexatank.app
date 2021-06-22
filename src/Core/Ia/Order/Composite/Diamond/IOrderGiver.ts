import { Order } from '../../Order';

export interface IOrderGiver {
	GetOrder(): Order;
}
