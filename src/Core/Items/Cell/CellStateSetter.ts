import { GameBlueprint } from '../../Framework/Blueprint/Game/GameBlueprint';
import { Gameworld } from '../../Framework/World/Gameworld';
import { Singletons, SingletonKey } from '../../../Singletons';
import { IGameworldService } from '../../../Services/World/IGameworldService';
import { Cell } from './Cell';
import { CellState } from './CellState';

export class CellStateSetter {
	public static SetStates(cells: Array<Cell>): void {
		const gameContextService = Singletons.Load<IGameworldService<GameBlueprint, Gameworld>>(
			SingletonKey.GameContext
		);
		if (gameContextService.Publish()) {
			cells.forEach((cell) => this.SetState(gameContextService.Publish(), cell));
		} else {
			cells.forEach((cell) => cell.SetState(CellState.Visible));
		}
	}

	public static SetState(gameContext: Gameworld, cell: Cell): void {
		const playerHq = gameContext.GetPlayerHq();
		if (playerHq !== null) {
			const territoty = playerHq.GetReactors().map((f) => f.GetInternal());

			let isContained = false;
			territoty.some((c) => (isContained = c.Exist(cell.Coo())));

			if (isContained) {
				cell.SetState(CellState.Visible);
			} else {
				if (cell.HasAllyNearby(gameContext.GetPlayer().Identity)) {
					cell.SetState(CellState.Visible);
				} else {
					if (cell.GetState() !== CellState.Hidden) {
						cell.SetState(CellState.Mist);
					}
				}
			}
		} else {
			cell.SetState(CellState.Visible);
		}
	}
}
