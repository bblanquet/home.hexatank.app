import {Vehicle} from './Vehicle';
import { PlaygroundHelper } from '../PlaygroundHelper';
import { Turrel } from './Turrel';
import { AliveItem } from '../AliveItem';
import { Ceil } from '../Ceil';
import { isNullOrUndefined, isNull } from 'util';
import { Headquarter } from '../Field/Headquarter';
import { IHqContainer } from '../IHqContainer';

export class Tank extends Vehicle implements IHqContainer 
{
    Hq: Headquarter; 
    Turrel:Turrel;
    private _currentTarget:AliveItem;
    private _mainTarget:AliveItem;

    constructor(hq:Headquarter)
    {
        super();
        this.Hq = hq;

        const wheels = ['./tank/wheel1.svg','./tank/wheel2.svg','./tank/wheel3.svg',
                    './tank/wheel4.svg','./tank/wheel5.svg','./tank/wheel6.svg',
                    './tank/wheel7.svg','./tank/wheel8.svg'
                    ];

        const wheelBottom = PlaygroundHelper.SpriteProvider.GetSprite('./tank/wheel.svg');
        this.DisplayObjects.push(wheelBottom);
        this.RootSprites.push(wheelBottom);

        wheels.forEach(wheel =>{
            const sprite = PlaygroundHelper.SpriteProvider.GetSprite(wheel);
            this.Wheels.push(sprite);
            this.DisplayObjects.push(sprite);
            this.RootSprites.push(sprite);

        });

        var sprite = this.Hq.GetSkin().GetBottomTankSprite();
        this.DisplayObjects.push(sprite);
        this.RootSprites.push(sprite);
        
        this.Turrel = new Turrel(this.Hq.GetSkin(),this);

        //make pivot sprite center
        this.GetSprites().forEach(sprite => {
            sprite.width = this.BoundingBox.Width,
            sprite.height = this.BoundingBox.Height
            sprite.anchor.set(0.5);
        });
        this.IsCentralRef = true;
    } 

    public SetPosition (ceil:Ceil):void{
        super.SetPosition(ceil);
        this.Turrel.InitPosition(ceil.GetBoundingBox());
    };

    public Destroy():void{
        super.Destroy();
        PlaygroundHelper.Render.Remove(this.Turrel);        
    } 

    public Update(viewX: number, viewY: number):void{
        super.Update(viewX,viewY);

        if(this._mainTarget != null && !this._mainTarget.IsAlive()){
            this._mainTarget = null;
        }
        if(this._currentTarget != null && !this._currentTarget.IsAlive()){
            this._currentTarget = null;
        }

        this.Turrel.Update(viewX,viewY);

        this.FindTargets();
    }

    public IsMainTargetClose():boolean
    {
        //find main target among surrounding enemies
        if (!isNullOrUndefined(this._mainTarget)) 
        {
            var ceils = this.GetCurrentCeil().GetAllNeighbourhood();

            let enemies = ceils.map(c=> (<Ceil>c)
                .GetShootableEntity())
                .filter(aliveItem=> !isNull(aliveItem));

            return this.ContainsMainTarget(enemies);
        }
        return false;
    }

    public IsEnemyHqClose():boolean{
        var ceils = this.GetCurrentCeil().GetAllNeighbourhood();

        let enemies = ceils.map(c=> (<Ceil>c)
            .GetShootableEntity())
            .filter(c=> !isNull(c))

        //find hq among enemies
        var hq = enemies.filter(c => c instanceof Headquarter).map(c => <Headquarter> c);
        if(hq.length >= 1){
            hq.some(element => {
                if(element.IsEnemy(this)){
                    return true;
                }
                return false;
            });
        }
        return false;
    }

    private FindTargets() {
        if(this.IsMainTargetClose()){
            this._currentTarget = this._mainTarget;
        }

        //find hq among enemies
        if(this.IsEnemyHqClose()){
            this.SetHqTarget();
            return;
        }

        this.FindRandomEnemy();
    }

    private FindRandomEnemy() {
        const ceils = this.GetCurrentCeil().GetAllNeighbourhood();
        //find random enemy among enemies
        const enemies = ceils.map(ceil => <AliveItem>((<Ceil>ceil).GetOccupier() as any))
            .filter(aliveItem => !isNullOrUndefined(aliveItem) && this.IsEnemy(aliveItem));
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

    private SetHqTarget():void {
        const ceils = this.GetCurrentCeil().GetAllNeighbourhood();
        const enemies = ceils.map(c=> (<Ceil>c)
        .GetShootableEntity())
        .filter(c=> !isNull(c));
        const hqs = enemies.filter(c => c instanceof Headquarter).map(c => <Headquarter>c);
        hqs.some(element => {
            if (element.IsEnemy(this)) {
                this._currentTarget = element;
                return true;
            }
            return false;
        });
    }

    private ContainsMainTarget(enemies: AliveItem[]) {
        return enemies.indexOf(this._mainTarget) === 1;
    }

    private IsHqContainer(item: any):item is IHqContainer{
        return 'Hq' in item;
    }

    public IsEnemy(item: AliveItem): boolean {
        if(this.IsHqContainer(item as any))
        {
            return (<IHqContainer>(item as any)).Hq !== this.Hq;
        }
        else if(item instanceof Headquarter)
        {
            return (<Headquarter>(item as any)) !== this.Hq;
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