export class BlueprintSetup {
	public IsFullIA: boolean;
	public IAs: Array<string>;
	public Env: string;
	public Shape: string;
	constructor() {
		this.IsFullIA = false;
		this.IAs = [ 'bob' ];
		this.Env = 'Forest';
		this.Shape = 'Flower';
	}
}
