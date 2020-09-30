import { CellUpdater } from './CellUpdater';
import { UnitUpdater } from './UnitUpdater';
import { RecordData } from '../../../../Core/Framework/Record/RecordData';
import { GameContext } from '../../../../Core/Framework/GameContext';
export class RecordCanvasUpdater {
	private _unitUpdater: UnitUpdater;
	private _cellUpdater: CellUpdater;

	constructor(private _ref: RecordData, private _gameContext: GameContext) {
		this._unitUpdater = new UnitUpdater(this._ref, this._gameContext);
		this._cellUpdater = new CellUpdater(this._ref, this._gameContext);
	}

	public SetDate(date: number): void {
		this._unitUpdater.Update(date);
		this._cellUpdater.Update(date);
	}
}
