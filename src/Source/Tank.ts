import {Vehicle} from './Vehicle';
import * as PIXI from 'pixi.js';
import { PlaygroundHelper } from './PlaygroundHelper';
import { TankHead } from './TankHead';
import { AliveItem } from './AliveItem';
import { Ceil } from './Ceil';
import { isNullOrUndefined, isNull } from 'util';
import { Headquarter } from './Field/Headquarter';
import { IHqContainer } from './IHqContainer';

export class Tank extends Vehicle implements IHqContainer
{
    Hq: Headquarter;
    Head:TankHead;
    private _currentTarget:AliveItem;
    private _mainTarget:AliveItem;

    constructor(hq:Headquarter)
    {
        super();
        this.Hq = hq;

        let wheels = ['tankWheel1','tankWheel2','tankWheel3',
                    'tankWheel4','tankWheel5','tankWheel6',
                    'tankWheel7'
                    ];

        wheels.forEach(wheel =>{
            let sprite = PlaygroundHelper.SpriteProvider.GetSprite(wheel);
            this.Wheels.push(sprite);
            this.DisplayObjects.push(sprite);
            this.RootSprites.push(sprite);
        });

        var sprite = this.Hq.GetSkin().GetBottomTankSprite();
        this.DisplayObjects.push(sprite);
        this.RootSprites.push(sprite);
        
        this.Head = new TankHead(this.Hq.GetSkin(),this);

        //make pivot sprite center
        this.GetSprites().forEach(sprite => {
            sprite.width = this.BoundingBox.Width,
            sprite.height = this.BoundingBox.Height
            sprite.pivot.set(PlaygroundHelper.Settings.Pivot
                ,PlaygroundHelper.Settings.Pivot);//beurk
        });
        this.IsCentralRef = true;

    } 

    public SetPosition (ceil:Ceil):void{
        super.SetPosition(ceil);
        PlaygroundHelper.Render.Add(this.Head);
    };

    public Destroy():void{
        super.Destroy();
        PlaygroundHelper.Render.Remove(this.Head);        
    } 

    Update(viewX: number, viewY: number, zoom: number):void{
        super.Update(viewX,viewY,zoom);

        if(this._mainTarget != null && !this._mainTarget.IsAlive()){
            this._mainTarget = null;
        }
        if(this._currentTarget != null && !this._currentTarget.IsAlive()){
            this._currentTarget = null;
        }

        this.Head.Update(viewX,viewY,zoom);

        this.FindTargets();
    }

    private FindTargets() {
        var ceils = this.GetCurrentCeil().GetAllNeighbourhood();

        let enemies  = ceils.map(c=> (<Ceil>c).GetShootableEntity()).filter(c=> !isNull(c))

        if (!isNullOrUndefined(this._mainTarget)) {
            var exist = enemies.indexOf(this._mainTarget) === -1 ? false : true;
            if(exist)
            {
                this._currentTarget = this._mainTarget;
            }
            else 
            {
                this._currentTarget = 0 < enemies.length ? enemies[0] : null;
            }
            return;
        }

        var hq = enemies.filter(c => c instanceof Headquarter).map(c => <Headquarter> c);
        var isFound = false;
        if(hq.length >= 1){
            hq.some(element => {
                if(element.IsEnemy(this)){
                    this._currentTarget = element;
                    isFound = true;
                    return true;
                }
                return false;
            });
        }
        if(isFound){
            return;
        }

        


        enemies = ceils.map(ceil=> <AliveItem>((<Ceil>ceil).GetMovable() as any))
                          .filter(aliveItem=> !isNullOrUndefined(aliveItem) && this.IsEnemy(aliveItem))

        if (!isNullOrUndefined(this._currentTarget)) {
            var exist = enemies.indexOf(this._currentTarget) === -1 ? false : true;
            if (!exist) {
                this._currentTarget = 0 < enemies.length ? enemies[0] : null;
            }
        }
        else {
            if (0 < enemies.length) {
                this._currentTarget = enemies[0];
            }
        }
    }

    private IsHqContainer(item: any):item is IHqContainer{
        return 'Hq' in item;
    }

    public IsEnemy(item: AliveItem): boolean {
        if(this.IsHqContainer(item as any))
        {
            return (<IHqContainer>(item as any)).Hq !== this.Hq;
        }
        return false;
    }

    public GetTarget():AliveItem{
        return this._currentTarget;
    }

    public SetMainTarget(item:AliveItem):void{
        this._mainTarget = item;
    }
}



    //private _ceilFinder:CeilFinder;
//        this._ceilFinder = new CeilFinder();


        // let context = obj as InteractionContext;
        // let finalCeil = item as Ceil;

        // if(finalCeil != null )
        // {
        //     if(!finalCeil.IsBlocked())
        //     {
        //         super.Selected(obj,item); 
        //     }
        //     else if(finalCeil.IsShootable() && !this.IsSettingPatrol)
        //     {
        //         let ceils = finalCeil.GetNeighbourhood().map(c => <Ceil>c);
        //         if(0 === finalCeil.GetAllNeighbourhood().filter(c=> c === this.CurrentCeil).length)
        //         {
        //             this.FinalCeil = this._ceilFinder.GetCeil(ceils, this);
        //             this.SetNextCeils(); 
        //         }
        //         this._mainTarget = finalCeil.GetShootableEntity();
        //     }
        // }

        // context.SelectionEvent.off(this.selectionFunc);