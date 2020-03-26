import { AStarEngine } from '../Ia/AStarEngine';
import { CellProperties } from '../Items/Cell/CellProperties';
import { CellContainer } from '../Items/Cell/CellContainer';

export class TestHelper {
	static CellContainer: CellContainer<CellProperties>;
	static Engine: AStarEngine<CellProperties>;

	static Init(): void {
		this.CellContainer = new CellContainer<CellProperties>();
		this.Engine = new AStarEngine<CellProperties>();
	}
}
