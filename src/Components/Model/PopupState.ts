import { GameStatus } from '../../Core/Framework/GameStatus';
import { Groups } from '../../Utils/Collections/Groups';
import { Curve } from '../../Utils/Stats/Curve';
import { StatsKind } from '../../Utils/Stats/StatsKind';
import { LineChart } from '../Common/Chart/Config/LineChart';

export class PopupState {
	constructor(
		public Chart: LineChart,
		public Status: GameStatus,
		public Curves: Groups<Curve>,
		public Kind: StatsKind,
		public Canvas: HTMLCanvasElement
	) {}
}
