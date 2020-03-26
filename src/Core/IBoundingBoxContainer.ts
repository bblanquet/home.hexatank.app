import { BoundingBox } from './Utils/Geometry/BoundingBox';

export interface IBoundingBoxContainer {
	GetBoundingBox(): BoundingBox;
}
