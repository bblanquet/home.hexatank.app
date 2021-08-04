import { StatsContext } from '../../Core/Framework/Stats/StatsContext';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { IStatsService } from './IStatsService';

export class StatsService implements IStatsService {
	private _stat: StatsContext;
	public Get(): StatsContext {
		return this._stat;
	}
	public Register(g: Gameworld): void {
		this._stat = new StatsContext(g);
	}
}
