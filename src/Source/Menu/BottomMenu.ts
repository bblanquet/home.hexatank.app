import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Headquarter } from "../Field/Headquarter";

export class BottomMenu extends Item
{
    private _text:PIXI.Text;
    private _graphics:PIXI.Graphics;
    private _graphics2:PIXI.Graphics;
    private Hq:Headquarter;
    private _diamondSprite:PIXI.Sprite;
    public GetBoundingBox(): BoundingBox {
        throw new Error("Method not implemented.");

    }
    public Select(context: InteractionContext): boolean {
        return false;
    }

    constructor(headquarter:Headquarter){
        super();
        this.Hq = headquarter;

        this._diamondSprite=new PIXI.Sprite(PlaygroundHelper.Render.Textures['diamondIcon']);
        this._diamondSprite.x = 10;
        this._diamondSprite.width = 28;
        this._diamondSprite.height = 28;

        this._graphics = new PIXI.Graphics();
        this._graphics2 = new PIXI.Graphics();
        this._graphics.beginFill(0x525252, 1);
        this._graphics2.beginFill(0xd480dc, 2);
        this._text = new PIXI.Text('0', { fontFamily: 'Arial', fontSize: 24, fill: 0xd480dc, align: 'center' });

        this.SetPosition();

        PlaygroundHelper.Render.AddSprite(this._graphics2);
        PlaygroundHelper.Render.AddSprite(this._graphics);
        PlaygroundHelper.Render.AddSprite(this._diamondSprite);
        PlaygroundHelper.Render.AddSprite(this._text);
    }

    private SetPosition() {
        let size = 30;
        let size2 = 32;
        this._text.x = size2 + 10;
        this._text.y = PlaygroundHelper.Settings.ScreenHeight - size;
        this._graphics2.drawRect(0, PlaygroundHelper.Settings.ScreenHeight - size2, PlaygroundHelper.Settings.ScreenWidth, size2);
        this._graphics.drawRect(0, PlaygroundHelper.Settings.ScreenHeight - size, PlaygroundHelper.Settings.ScreenWidth, size);
        this._diamondSprite.y = PlaygroundHelper.Settings.ScreenHeight-30;
    }

    public Update(viewX: number, viewY: number, zoom: number): void {
        this.SetPosition();
        this._text.text = this.Hq.Diamonds.toString();
    }
}