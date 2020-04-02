import { GameSettings } from '../../Framework/GameSettings';
import { Cell } from './Cell';
import { CellState } from './CellState';
import { GameContext } from '../../Framework/GameContext';

export class CellStateSetter {
	public static SetStates(gameContext: GameContext, cells: Array<Cell>): void {
		cells.forEach((cell) => this.SetState(gameContext, cell));
	}

	public static SetState(gameContext: GameContext, cell: Cell): void {
		const territoty = gameContext.MainHq.GetInfluence().map((f) => f.GetArea());

		let isContained = false;
		territoty.some((c) => (isContained = c.Exist(cell.GetCoordinate())));

		if (isContained) {
			cell.SetState(CellState.Visible);
		} else {
			if (GameSettings.ShowEnemies) {
				if (cell.HasAroundOccupier()) {
					cell.SetState(CellState.Visible);
				} else {
					if (cell.GetState() !== CellState.Hidden) {
						cell.SetState(CellState.Mist);
					}
				}
			} else {
				if (cell.HasAroundAlly(gameContext.MainHq)) {
					cell.SetState(CellState.Visible);
				} else {
					if (cell.GetState() !== CellState.Hidden) {
						cell.SetState(CellState.Mist);
					}
				}
			}
		}
	}
}
