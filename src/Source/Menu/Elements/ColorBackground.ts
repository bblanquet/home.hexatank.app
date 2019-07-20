import { BoundingBox } from "../../Core/Utils/BoundingBox";
import { InteractionContext } from "../../Core/Context/InteractionContext";
import * as PIXI from 'pixi.js';
import { Item } from "../../Core/Items/Item";
import { PlaygroundHelper } from "../../Core/Utils/PlaygroundHelper";

export class ColorBackground extends Item{

    private _boundingBox:BoundingBox;
    private _background:PIXI.Graphics;
    private _color:number;

    constructor(color:number)//0x525252
    {
        super();
        this._color = color;
        this.Z = 6;
        this._background = new PIXI.Graphics();
        this.GetDisplayObjects().push(this._background);
        PlaygroundHelper.Render.Add(this);
    }

    private SetPosition() {

        this._background.clear();

        this._background.beginFill(this._color, 1);
        this._background.drawRect(0
            , 0
            , PlaygroundHelper.Settings.ScreenWidth
            , PlaygroundHelper.Settings.ScreenHeight);
        this._background.endFill();
    }

    public Update(viewX: number, viewY: number): void {
        this.SetPosition();
    }

    public GetBoundingBox(): BoundingBox {
        return this._boundingBox;
    }    
    
    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Destroy(): void 
    {
        super.Destroy();
        this.IsUpdatable = false;
        PlaygroundHelper.Render.Remove(this); 
    }
}