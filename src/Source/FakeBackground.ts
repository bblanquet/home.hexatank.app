import { BoundingBox } from "./BoundingBox";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { Item } from "./Item";
import { InteractionContext } from "./Context/InteractionContext";

export class FakeBackground extends Item{
    private _boundingBox:BoundingBox;
    private _background:PIXI.Graphics;

    constructor()
    {
        super();
        this.Z = 5;
        this._background = new PIXI.Graphics();
        this.GetDisplayObjects().push(this._background);
        PlaygroundHelper.Render.Add(this);
    }

    private SetPosition() {

        this._background.clear();

        this._background.beginFill(0x525252, 1);
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