import { StatsContext } from '../../Core/Framework/Stats/StatsContext';
import { Gameworld } from '../../Core/Framework/World/Gameworld';

export interface IStatsService {
	Get(): StatsContext;
	Register(g: Gameworld): void;
}
