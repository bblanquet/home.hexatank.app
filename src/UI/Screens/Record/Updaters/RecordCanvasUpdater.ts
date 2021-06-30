import { CellUpdater } from './CellUpdater';
import { UnitUpdater } from './UnitUpdater';
import { RecordContent } from '../../../../Core/Framework/Record/Model/RecordContent';
import { GameContext } from '../../../../Core/Framework/Context/GameContext';
export class RecordCanvasUpdater {
	private _unitUpdater: UnitUpdater;
	private _cellUpdater: CellUpdater;

	constructor(private _ref: RecordContent, private _gameContext: GameContext) {
		this._unitUpdater = new UnitUpdater(this._ref, this._gameContext);
		this._cellUpdater = new CellUpdater(this._ref, this._gameContext);
	}

	public SetDate(date: number): void {
		this._unitUpdater.Update(date);
		this._cellUpdater.Update(date);
	}
}
