import { MapKind } from '../../../Core/Framework/Blueprint/Items/MapKind';
import { MapShape } from '../../../Core/Framework/Blueprint/Items/MapShape';

export class BlueprintSetup {
	public onylIa: boolean;
	public IaCount: number;
	public Env: string;
	public Size: string;
	public Shape: string;
	constructor() {
		this.onylIa = false;
		this.IaCount = 1;
		this.Env = 'Forest';
		this.Shape = 'Flower';
		this.Size = 'Small';
	}
}
