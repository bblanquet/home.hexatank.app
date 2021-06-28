import { Vehicle } from '../../Items/Unit/Vehicle';

export class VehicleStatus {
	constructor(private _v: Vehicle, private _cid: string, private _nextCid: string) {}

	public IsDiverging(): boolean {
		let nextCid = '';
		if (this._v.HasNextCell()) {
			nextCid = this._v.GetNextCell().Coo();
		}
		return this.IsOnTime() && this._nextCid !== nextCid;
	}

	public IsOnTime(): boolean {
		const cid = this._v.GetCurrentCell().Coo();
		return cid === this._cid;
	}

	public IsLate(): boolean {
		const cid = this._v.GetCurrentCell().Coo();
		return cid === this._nextCid;
	}

	public IsUnsync(): boolean {
		return !(this.IsOnTime() || this.IsLate());
	}
}
