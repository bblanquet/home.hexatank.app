export class BlueprintSetup {
	public IsFullIA: boolean;
	public IAs: Array<string>;
	public Env: string;
	public Shape: string;
	constructor() {
		this.IsFullIA = false;
		this.IAs = [ 'Weak' ];
		this.Env = 'Forest';
		this.Shape = 'Flower';
	}
}
