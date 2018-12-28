import {Vehicle} from './Vehicle';
import * as PIXI from 'pixi.js';
import {Dust} from './Dust';
import { BoundingBox } from './BoundingBox';
import { PlaygroundHelper } from './PlaygroundHelper';
import { TankHead } from './TankHead';
import { AliveItem } from './AliveItem';
import { Ceil } from './Ceil';
import { isNullOrUndefined, isNull } from 'util';
import { InteractionContext } from './InteractionContext';
import { Item } from './Item';
import { CeilFinder } from './CeilFinder';

export class Tank extends Vehicle
{
    Head:TankHead;
    private _target:AliveItem;
    private _mainTarget:AliveItem;
    private _ceilFinder:CeilFinder;

    constructor()
    {
        super();

        let wheels = ['track1.png','track2.png','track3.png',
                    'track4.png','track5.png','track6.png',
                    'track7.png'
                    ];
        wheels.forEach(wheel =>{
            let sprite = new PIXI.Sprite(PlaygroundHelper.Render.Textures[wheel]);
            this.Wheels.push(sprite);
            this.DisplayObjects.push(sprite);
            this.RootSprites.push(sprite);
        });

        var sprite = new PIXI.Sprite(PlaygroundHelper.Render.Textures["unitBottom.png"]);
        this.DisplayObjects.push(sprite);
        this.RootSprites.push(sprite);
        
        this.Head = new TankHead(this);

        //make pivot sprite center
        this.GetSprites().forEach(sprite => {
            sprite.width = this.BoundingBox.Width,
            sprite.height = this.BoundingBox.Height
            sprite.pivot.set(PlaygroundHelper.Settings.Pivot
                ,PlaygroundHelper.Settings.Pivot);//beurk
        });
        this.IsCentralRef = true;

        this._ceilFinder = new CeilFinder();
    } 

    public Destroy():void{
        super.Destroy();
        PlaygroundHelper.Render.Remove(this.Head);        
    }

    CreateDust(x:number,y:number):void
    {
        var b = new BoundingBox();
        b.X = x;
        b.Y = y;
        b.Width = this.GetBoundingBox().Width/5;
        b.Height = this.GetBoundingBox().Width/5;

        var dust = new Dust(b);
        PlaygroundHelper.Render.Add(dust);
        this.Dusts.push(dust);
    }

    Update(viewX: number, viewY: number, zoom: number):void{
        super.Update(viewX,viewY,zoom);

        if(this._mainTarget != null && !this._mainTarget.IsAlive()){
            this._mainTarget = null;
        }
        if(this._target != null && !this._target.IsAlive()){
            this._target = null;
        }

        this.Head.Update(viewX,viewY,zoom);

        this.FindTargets();
    }

    private FindTargets() {
        var ceils = this.CurrentCeil.GetAllNeighbourhood();

        let aliveItems  = ceils.map(c=> (<Ceil>c).GetShootableEntity()).filter(c=> !isNull(c))

        if (!isNullOrUndefined(this._mainTarget)) {
            var exist = aliveItems.indexOf(this._mainTarget) === -1 ? false : true;
            if (!exist) {
                this._mainTarget = 0 < aliveItems.length ? aliveItems[0] : null;
            }
        }

        aliveItems = ceils.map(c=> <AliveItem>((<Ceil>c).GetMovable() as any)).filter(c=> !isNull(c))

        if (!isNullOrUndefined(this._target)) {
            var exist = aliveItems.indexOf(this._target) === -1 ? false : true;
            if (!exist) {
                this._target = 0 < aliveItems.length ? aliveItems[0] : null;
            }
        }
        else {
            if (0 < aliveItems.length) {
                this._target = aliveItems[0];
            }
        }
    }

    public GetTarget():AliveItem{
        if(this._mainTarget != null){
            return this._mainTarget;
        }
        if(this._target != null){
            return this._target;
        }
        return null;
    }

    protected Selected(obj:any, item:Item):void
    {
        var context = obj as InteractionContext;
        var finalCeil = item as Ceil;
        //console.log(`%c SELECTED `,'color:green; font-weight:bold;');

        if(finalCeil != null )//&& finalCeil IsShootable()!finalCeil.IsBlocked()
        {
            if(!finalCeil.IsBlocked())
            {
                this.FinalCeil = finalCeil;
                this.SetNextCeils(); 
            }
            else if(finalCeil.IsShootable())
            {
                this.FinalCeil = this._ceilFinder.GetCeil(finalCeil.GetNeighbourhood().map(c => <Ceil>c), this);
                this._mainTarget = finalCeil.GetShootableEntity();
                this.SetNextCeils(); 
            }
            //console.log(`%c opened nodes: ${this.NextCeils.length} `,'color:blue;','font-weight:bold;');
        }

        context.SelectionEvent.off(this.selectionFunc);
    }
}