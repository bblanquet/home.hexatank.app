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

        this._text = new PIXI.Text('0', { fontFamily: 'Arial', fontSize: 24, fill: 0xd480dc, align: 'center' });
        this._border = new PIXI.Graphics();
        this._background = new PIXI.Graphics();


        this.SetPosition();

        PlaygroundHelper.Render.AddDisplayableEntity(this._border);
        PlaygroundHelper.Render.AddDisplayableEntity(this._background);
        PlaygroundHelper.Render.AddDisplayableEntity(this._diamondSprite);
        PlaygroundHelper.Render.AddDisplayableEntity(this._text);
    }

    private _first:boolean=false;

    private First():void{
        this._first = true;

        let size = 30;
        let size2 = 32;

 
    }

    private SetPosition() {
        let size = 30;
        let size2 = 32;
        this._text.x = size2 + 10;
        this._text.y = PlaygroundHelper.Settings.ScreenHeight - size;

        this._background.clear();

        this._background.beginFill(0x525252, 1);
        this._background.drawRect(0, PlaygroundHelper.Settings.ScreenHeight - size, PlaygroundHelper.Settings.ScreenWidth, size);
        this._background.endFill();

        this._border.clear();

        this._border.beginFill(0xd480dc, 2);
        this._border.drawRect(0, PlaygroundHelper.Settings.ScreenHeight - size2, PlaygroundHelper.Settings.ScreenWidth, size2);
        this._border.endFill();

        //console.log(this._border.y);

        this._diamondSprite.y = PlaygroundHelper.Settings.ScreenHeight-30;
    }

    public Update(viewX: number, viewY: number, zoom: number): void {
        if(!this.First){
            this.First();
        }
        this.SetPosition();
        this._text.text = this.Hq.Diamonds.toString();
    }
}