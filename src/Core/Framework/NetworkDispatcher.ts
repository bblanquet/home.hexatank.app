import { GameContext } from './GameContext';
export class NetworkDispatcher {
	public constructor(private _gameContext: GameContext) {
		this._gameContext.GetCells();

		this._gameContext.GetHqs().forEach((hq) => {
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
		});
	}

	private HandleVehicleCreated(): void {}
}
