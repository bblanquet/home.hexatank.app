import { CellUpdater } from './CellUpdater';
import { UnitUpdater } from './UnitUpdater';
import { RecordContent } from '../../../Core/Framework/Record/Model/RecordContent';
import { Gameworld } from '../../../Core/Framework/World/Gameworld';
export class RecordCanvasUpdater {
	private _unitUpdater: UnitUpdater;
	private _cellUpdater: CellUpdater;

	constructor(private _ref: RecordContent, private _gameworld: Gameworld) {
		this._unitUpdater = new UnitUpdater(this._ref, this._gameworld);
		this._cellUpdater = new CellUpdater(this._ref, this._gameworld);
	}

	public SetDate(date: number): void {
		this._unitUpdater.Update(date);
		this._cellUpdater.Update(date);
	}
}
