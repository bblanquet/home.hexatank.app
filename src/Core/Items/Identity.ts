import { ItemSkin } from './ItemSkin';

export class Identity {
	constructor(public Name: string, public Skin: ItemSkin, public IsPlayer: boolean) {}

	public IsEnemy(id: Identity): boolean {
		return !id || (id && id.Name !== this.Name);
	}
}
