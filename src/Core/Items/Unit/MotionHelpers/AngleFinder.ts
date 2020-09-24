import { IAngleFinder } from './IAngleFinder';
import { IRotatable } from './IRotatable';
import * as PIXI from 'pixi.js';
import { IBoundingBoxContainer } from '../../../IBoundingBoxContainer';

export class AngleFinder<T extends IRotatable & IBoundingBoxContainer> implements IAngleFinder {
	private _item: T;

	constructor(item: T) {
		this._item = item;
	}

	public SetAngle(cell: IBoundingBoxContainer): void {
		var aPoint = new PIXI.Point(this._item.GetBoundingBox().GetCenter(), this._item.GetBoundingBox().GetMiddle());
		var bPoint = new PIXI.Point(
			this._item.GetBoundingBox().GetCenter(),
			this._item.GetBoundingBox().GetMiddle() + 1
		);
		var cPoint = new PIXI.Point(cell.GetBoundingBox().GetCenter(), cell.GetBoundingBox().GetMiddle());

		this._item.GoalRadius =
			Math.atan2(cPoint.y - bPoint.y, cPoint.x - bPoint.x) - Math.atan2(aPoint.y - bPoint.y, aPoint.x - bPoint.x);
	}
}
