import { BasicItem } from './../BasicItem';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { SvgArchive } from '../../Framework/SvgArchiver';

export class SimpleFloor extends BasicItem {
	constructor(boundingBox: BoundingBox, sprite: string, z: number = 0) {
		super(boundingBox, sprite, z);
		SvgArchive.nature.grass.forEach((g) => {
			this.GenerateSprite(g, (e) => {
				e.anchor.set(0.5);
				e.alpha = 0;
			});
		});
		this.InitPosition(boundingBox.GetPosition());
		this.IsCentralRef = true;
	}

	public Update(): void {
		super.Update();
	}
}
