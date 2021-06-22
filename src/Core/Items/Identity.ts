import { ItemSkin } from './ItemSkin';

export class Identity {
	constructor(public Name: string, public Skin: ItemSkin, public IsPlayer: boolean) {}

	public GetRelation(id: Identity): Relationship {
		if (!id) {
			return Relationship.Neutral;
		} else if (id.Name !== this.Name) {
			return Relationship.Enemy;
		} else {
			return Relationship.Ally;
		}
	}
}

export enum Relationship {
	Neutral,
	Enemy,
	Ally
}
