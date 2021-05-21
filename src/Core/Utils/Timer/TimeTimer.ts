import { ITimer } from './ITimer';

export class TimeTimer implements ITimer {
	private _currentDate: number;
	constructor(private _milliseconds: number) {
		this._currentDate = Date.now() + this._milliseconds;
	}

	Reset(): void {
		this._currentDate = Date.now() + this._milliseconds;
	}

	SetTicks(milliseconds: number): void {
		if (milliseconds <= 1) {
			throw 'has to be higher than 1';
		}
		this._milliseconds = milliseconds;
		this._currentDate = Date.now() + this._milliseconds;
	}

	IsElapsed(): boolean {
		const result = this._currentDate < Date.now();
		if (result) {
			this._currentDate = Date.now() + this._milliseconds;
		}
		return result;
	}
}
