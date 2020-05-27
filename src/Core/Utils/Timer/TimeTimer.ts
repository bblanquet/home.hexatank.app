import { ITimer } from './ITimer';

export class TimeTimer implements ITimer {
	private _currentDate: number;
	constructor(private _tick: number) {
		this._currentDate = Date.now() + this._tick;
	}

	SetTicks(milliseconds: number): void {
		if (milliseconds <= 1) {
			throw 'has to be higher than 1';
		}
		this._tick = milliseconds;
		this._currentDate = Date.now() + this._tick;
	}

	IsElapsed(): boolean {
		const result = this._currentDate < Date.now();
		if (result) {
			this._currentDate = Date.now() + this._tick;
		}
		return result;
	}
}
