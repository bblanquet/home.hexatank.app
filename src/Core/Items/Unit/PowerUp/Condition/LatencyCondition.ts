import { IOrder } from '../../../../Ia/Order/IOrder';
import { Cell } from '../../../Cell/Cell';
import { Vehicle } from '../../Vehicle';
import { UpCondition } from './UpCondition';

export class LatencyCondition extends UpCondition {
	private Stopping: any = this.Stop.bind(this);

	public constructor(private _v: Vehicle, private _order: IOrder) {
		super();
		this._v.OnCellChanged.On(this.Stopping);
		this._v.OnOrdered.On(this.Stopping);
	}

	private Stop(e: any, formerCell: Cell): void {
		if (!(this._v.IsCurrentOrderEqualed(this._order) || this._v.IsCurrentOrderEqualed(this._order))) {
			this._v.OnCellChanged.Off(this.Stopping);
			this._v.OnOrdered.Off(this.Stopping);
			this.Done.Invoke();
		}
	}
}
