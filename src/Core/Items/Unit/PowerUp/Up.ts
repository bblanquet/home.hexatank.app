import { Item } from '../../Item';
import { TimeTimer } from '../../../Utils/Timer/TimeTimer';

export abstract class Up extends Item {
	protected _activeTimer: TimeTimer;
	protected _isActive: boolean;
	private _isCell: boolean;

	public IsCellPower(): boolean {
		return this._isCell;
	}

	public SetCellPower(isPower: boolean) {
		this._isCell = isPower;
	}

	public IsActive(): boolean {
		return this._isActive;
	}

	public abstract SetActive(isActive: boolean): void;
	public abstract GetCurrentRotation(): number;
	public abstract SetCurrentRotation(radian: number): void;
}
