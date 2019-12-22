import { BoundingBox } from "./BoundingBox";

export class ViewContext{
    public BoundingBox:BoundingBox;
    public Scale:number;    constructor(){
        this.BoundingBox = new BoundingBox();
        this.Scale = 1;
    }
}