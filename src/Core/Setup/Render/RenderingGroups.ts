import * as PIXI from 'pixi.js';

export class RenderingGroups {
	public Z: { [id: number]: PIXI.Container };
	private _fixedParent: PIXI.Container;
	private _parent: PIXI.Container;

	constructor(
		layout: { zs: Array<number>; parent: PIXI.Container },
		fixedLayout: { zs: Array<number>; parent: PIXI.Container }
	) {
		this.Z = {};
		this._parent = layout.parent;
		this._fixedParent = fixedLayout.parent;

		layout.zs.forEach((z) => {
			var group = new PIXI.Container();
			this._parent.addChild(group);
			this.Z[z] = group;
		});

		fixedLayout.zs.forEach((z) => {
			var group = new PIXI.Container();
			this._fixedParent.addChild(group);
			this.Z[z] = group;
		});
	}

	public Clear(): void {
		for (var key in this.Z) {
			delete this.Z[key];
		}
		this._fixedParent.destroy();
		this._parent.destroy();
	}
}
