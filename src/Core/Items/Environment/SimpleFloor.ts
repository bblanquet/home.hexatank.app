import { BasicItem } from './../BasicItem';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { Archive } from '../../Framework/ResourceArchiver';

export class SimpleFloor extends BasicItem {
	constructor(boundingBox: BoundingBox, sprite: string, z: number = 0) {
		super(boundingBox, sprite, z);
		Archive.nature.grass.forEach((g) => {
			this.GenerateSprite(g, (e) => {
				e.anchor.set(0.5);
				e.alpha = 0;
			});
		});
		this.InitPosition(boundingBox);
		this.IsCentralRef = true;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
	}
}
