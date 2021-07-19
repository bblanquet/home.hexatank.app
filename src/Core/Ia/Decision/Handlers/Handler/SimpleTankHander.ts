import { MapObserver } from './../../MapObserver';
import { Squad } from '../../Troop/Squad';
import { Brain } from '../../Brain';
import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { RequestType } from '../../Utils/RequestType';
import { AreaRequest } from '../../Utils/AreaRequest';
import { GameContext } from '../../../../Framework/Context/GameContext';

export class SimpleTankHander implements ISimpleRequestHandler {
	constructor(private _gameContext: GameContext, private _brain: Brain) {}

	Handle(request: AreaRequest): void {
		const foeHqs = this._gameContext.GetHqs().filter((h) => h !== this._brain.Hq);
		if (0 < foeHqs.length) {
			const squad = new Squad(new MapObserver(this._brain.AllAreas, this._brain.Hq), this._brain);

			if (squad.SetMainTarget()) {
				if (this._brain.Hq.CreateTank()) {
					const tank = this._brain.Tanks[this._brain.Tanks.length - 1];
					squad.AddTank(tank);
					this._brain.Squads.push(squad);
				}
			}
		}
	}

	Type(): RequestType {
		return RequestType.Tank;
	}
}
