import { BoundingBox } from "./BoundingBox";

export class ViewContext{
    BoundingBox:BoundingBox;
    Zoom:number;

    constructor(){
        this.BoundingBox = new BoundingBox();
        this.Zoom = 1;
    }
}