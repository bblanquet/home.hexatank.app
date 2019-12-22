import { CamouflageHandler } from '../../Utils/CamouflageHandler';
import { Ceil } from '../../Ceils/Ceil';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { PeerHandler } from './../../../Menu/Network/Host/On/PeerHandler';
import {Vehicle} from './Vehicle';
import { Turrel } from './Turrel';
import { AliveItem } from '../AliveItem';
import { isNullOrUndefined, isNull } from 'util';
import { IHqContainer } from './IHqContainer';
import { Headquarter } from '../../Ceils/Field/Headquarter';
import { Archive } from '../../Utils/ResourceArchiver';
import { CeilState } from '../../Ceils/CeilState';
import { PacketKind } from '../../../Menu/Network/PacketKind';
import { BasicItem } from '../BasicItem';
import { BoundingBox } from '../../Utils/BoundingBox';
import { Explosion } from './Explosion';

export class Tank extends Vehicle implements IHqContainer 
{
    Turrel:Turrel;
    private _currentTarget:AliveItem;
    private _mainTarget:AliveItem;
 
    constructor(hq:Headquarter)
    {
        super(hq);

        this.Wheels = Archive.wheels;

        this.GenerateSprite(Archive.wheel);
        this.RootSprites.push(Archive.wheel);

        this.Wheels.forEach(wheel =>{
            this.GenerateSprite(wheel);
            this.RootSprites.push(wheel);
        });

        this.RootSprites.push(this.Hq.GetSkin().GetBottomTankSprite());
        this.GenerateSprite(this.Hq.GetSkin().GetBottomTankSprite());
        
        this.Turrel = new Turrel(this.Hq.GetSkin(),this);

        //make pivot sprite center
        this.GetSprites().forEach(sprite => {
            sprite.width = this.BoundingBox.Width,
            sprite.height = this.BoundingBox.Height
            sprite.anchor.set(0.5);
        });
        this.IsCentralRef = true;
    } 

    protected OnCellStateChanged(obj:any,ceilState: CeilState): void 
    {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible;
        });
        this.Turrel.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible;
        });    
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

        if(this._mainTarget != null && !this._mainTarget.IsAlive())
        {
            this._mainTarget = null;
        }

        if(this._currentTarget != null && !this._currentTarget.IsAlive())
        {
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
            .filter(c=> !isNullOrUndefined(c))

        //find hq among enemies
        var hq = enemies.filter(c => c instanceof Headquarter).map(c => <Headquarter> c);
        if(hq.length >= 1){
            return hq.some(element => {
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
            return;
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
            .filter(aliveItem => !isNullOrUndefined(aliveItem) && this.IsEnemy(aliveItem))
            .filter(c=>(c instanceof Vehicle && !(<Vehicle>c).HasCamouflage) || c instanceof Headquarter);
        
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
        return enemies.filter(e=>e===this._mainTarget).length === 1;
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
        PeerHandler.SendMessage(PacketKind.Target,{
            Hq:this.Hq.GetCeil().GetCoordinate(),
            Ceil:this.GetCurrentCeil().GetCoordinate(),
            TargetCeil:item.GetCurrentCeil().GetCoordinate(),
        });
        this._mainTarget = item;
    }

    public GetMainTarget():AliveItem{
        return this._mainTarget;
    }

    SetCamouflage():boolean {
        if(this.HasNextCeil()){
            return false;
        }
        this.HasCamouflage = true;
        this.camouflagedSprites = this.GetSprites().filter(s=>s.alpha !== 0);
        this.camouflagedSprites.concat(this.Turrel.GetSprites().filter(s=>s.alpha !== 0));
        
        if(PlaygroundHelper.PlayerHeadquarter === this.Hq){
            this.camouflagedSprites.forEach(s=>{
                s.alpha = 0.5;
            });
        }
        else
        {
            this.camouflagedSprites.forEach(s=>{
                s.alpha = 0;
            });
        }

        PeerHandler.SendMessage(PacketKind.Camouflage,{
            Hq:this.Hq.GetCeil().GetCoordinate(),
            Ceil:this.GetCurrentCeil().GetCoordinate(),
        });

        this.Camouflage = new BasicItem(BoundingBox.CreateFromBox(this.GetBoundingBox()), CamouflageHandler.GetCamouflage(),5);
        this.Camouflage.SetVisible(()=>this.IsAlive() && this.HasCamouflage);
        this.Camouflage.SetAlive(()=>this.IsAlive() && this.HasCamouflage);
        PlaygroundHelper.Playground.Items.push(this.Camouflage);
        const explosion = new Explosion(BoundingBox.CreateFromBox(this.GetBoundingBox()),Archive.constructionEffects,5,false,5);
        PlaygroundHelper.Playground.Items.push(explosion);

        return true;
    }

    RemoveCamouflage(){
        if(this.HasCamouflage){
            this.HasCamouflage = false;

            if(PlaygroundHelper.PlayerHeadquarter === this.Hq){
                this.camouflagedSprites.forEach(s=>{
                    s.alpha = 1;
                });
            }
            else
            {
                if(this.GetCurrentCeil().GetState() === CeilState.Visible){
                    this.camouflagedSprites.forEach(s=>{
                        s.alpha = 1;
                    });
                }else{
                    this.camouflagedSprites.forEach(s=>{
                        s.alpha = 0;
                    });
                }
            }
            this.camouflagedSprites = [];
        }
    }

}