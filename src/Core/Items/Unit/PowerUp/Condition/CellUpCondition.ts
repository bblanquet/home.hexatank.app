import { UpCondition } from './UpCondition';
import { Vehicle } from '../../Vehicle';
import { Cell } from '../../../Cell/Cell';

export class CellUpCondition extends UpCondition {
	public constructor(private _v: Vehicle) {
		super();
		this._v.OnCellChanged.On((e: any, formerCell: Cell) => {
			if (this._v.GetCurrentCell().GetField().constructor.name !== formerCell.GetField().constructor.name) {
				this.Done.Invoke();
			}
		});
	}
}
