import { AStarEngine } from '../Ia/AStarEngine';
import { CellProperties } from '../Items/Cell/CellProperties';
import { CellContext } from '../Items/Cell/CellContext';

export class TestHelper {
	static CellContainer: CellContext<CellProperties>;
	static Engine: AStarEngine<CellProperties>;

	static Init(): void {
		this.CellContainer = new CellContext<CellProperties>();
		this.Engine = new AStarEngine<CellProperties>();
	}
}
