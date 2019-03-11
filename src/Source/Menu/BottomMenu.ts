import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Headquarter } from "../Field/Headquarter";

export class BottomMenu extends Item
{
    private _text:PIXI.Text;
    private _background:PIXI.Graphics;
    private _border:PIXI.Graphics;
    private Hq:Headquarter;
    private _diamondSprite:PIXI.Sprite;


    constructor(headquarter:Headquarter){
        super();
        this.Hq = headquarter;

        this._diamondSprite=PlaygroundHelper.SpriteProvider.GetSprite('diamondIcon');
        this._diamondSprite.x = 10;
        this._diamondSprite.width = 28;
        this._diamondSprite.height = 28;

        this._text = new PIXI.Text('0', { fontFamily: 'Arial', fontSize: 24, fill: 0xd480dc, align: 'center' });
        this._border = new PIXI.Graphics();
        this._background = new PIXI.Graphics();

        this.SetPosition();

        PlaygroundHelper.Render.AddDisplayableEntity(this._border);
        PlaygroundHelper.Render.AddDisplayableEntity(this._background);
        PlaygroundHelper.Render.AddDisplayableEntity(this._diamondSprite);
        PlaygroundHelper.Render.AddDisplayableEntity(this._text);
    }

    public GetBoundingBox(): BoundingBox {
        throw new Error("Method not implemented.");

    }
    public Select(context: InteractionContext): boolean {
        return false;
    }

    private SetPosition() {
        const margin = 30/PlaygroundHelper.Settings.Scale;
        const rectSize = 32/PlaygroundHelper.Settings.Scale;
        this._text.x = rectSize + 10/PlaygroundHelper.Settings.Scale;
        this._text.y = PlaygroundHelper.Settings.GetRelativeHeight() - margin;

        this._background.clear();

        this._background.beginFill(0x525252, 1);
        this._background.drawRect(0
            , PlaygroundHelper.Settings.GetRelativeHeight() - margin
            , PlaygroundHelper.Settings.GetRelativeWidth() 
            , margin);
        this._background.endFill();

        this._border.clear();

        this._border.beginFill(0xd480dc, 2);
        this._border.drawRect(0
            , PlaygroundHelper.Settings.GetRelativeHeight() - rectSize
            , PlaygroundHelper.Settings.GetRelativeWidth() 
            , rectSize);
        this._border.endFill();


        this._diamondSprite.y = PlaygroundHelper.Settings.GetRelativeHeight()-margin;
    }

    public Update(viewX: number, viewY: number): void {
        this.SetPosition();
        this._text.text = this.Hq.Diamonds.toString();
    }
}