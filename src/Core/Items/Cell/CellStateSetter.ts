import { GameSettings } from '../../Framework/GameSettings';
import { GameHelper } from '../../Framework/GameHelper';
import { Cell } from './Cell';
import { CellState } from './CellState';

export class CellStateSetter {
	public static SetStates(cells: Array<Cell>): void {
		cells.forEach((cell) => this.SetState(cell));
	}

	public static SetState(cell: Cell): void {
		const territoty = GameHelper.PlayerHeadquarter.GetInfluence().map((f) => f.GetArea());

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
				if (cell.HasAroundAlly(GameHelper.PlayerHeadquarter)) {
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
