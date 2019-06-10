import { IMapGenerator } from "./IMapGenerator";
import { Diamond } from "../Field/Diamond";
import { Item } from "../Item";
import { CeilDecorator } from "../CeilDecorator";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Headquarter } from "../Field/Headquarter";
import { HqSkin } from "../HqSkin";
import { IaHeadquarter } from "../Ia/Hq/IaHeadquarter";  
import { Cloud } from "../Cloud";
import { EmptyMenuItem } from "../Menu/EmptyMenuItem";
import { TankMenuItem } from "../Menu/TankMenuItem";
import { TruckMenuItem } from "../Menu/TruckMenuItem";
import { HealMenuItem } from "../Menu/HealMenuItem";
import { AttackMenuItem } from "../Menu/AttackMenuItem";
import { SpeedFieldMenuItem } from "../Menu/SpeedFieldMenuItem"; 
import { LeftMenu } from "../Menu/LeftMenu";
import { PatrolMenuItem } from "../Menu/PatrolMenuItem";
import { CancelMenuItem } from "../Menu/CancelMenuItem"; 
import { TopBar } from "../Menu/TopBar";
import { FlowerMapBuilder } from "./FlowerMapBuilder";
import { BasicItem } from "../BasicItem";
import { BoundingBox } from "../BoundingBox";
import {Archive} from "../Tools/ResourceArchiver"
import { TargetMenuItem } from "../Menu/TargetMenuItem";
import { Menu } from "../Menu/Menu";
import { ISelectable } from "../ISelectable";
import { Vehicle } from "../Unit/Vehicle";
import { Ceil } from "../Ceil";
import { ZoomInButton } from "../Menu/ZoomInButton";
import { ZoomOutButton } from "../Menu/ZoomOutButton";
import { TopMenu } from "../Menu/TopMenu";
import { MoneyMenuItem } from "../Menu/MoneyMenuItem";
import { CeilState } from "../CeilState"; 
import { ShowEnemiesMenuItem } from "../Menu/ShowEnemiesMenuItem";
import { HexAxial } from "../Coordinates/HexAxial";
import { FartestPointsFinder } from "./FartestPointsFinder";

export class MapGenerator implements IMapGenerator{

    private _currentHq:Headquarter;
    private _menus:Menu[]=[];

    public GetHq():Headquarter{
        return this._currentHq;
    }

    public GetMenus(): Menu[] {
        return this._menus;
    }

    public SetMap():Array<Item>{
        const items = new Array<Item>();
        const size = 20;
        const mapBuilder = new FlowerMapBuilder();
        const ceils = mapBuilder.Build(size);
        
        ceils.forEach(ceil => {
            PlaygroundHelper.CeilsContainer.Add(ceil);
            items.push(ceil);
        });

        const middleAreas = mapBuilder.GetAreaMiddleCeil(size);
        PlaygroundHelper.Settings.MapSize = middleAreas.length * 6; 
        const middleCeil = mapBuilder.GetMidle(size);
        middleAreas.push(mapBuilder.GetMidle(size));
        this.SetGrass(middleAreas, items);
        
        const diamond = new Diamond(PlaygroundHelper.CeilsContainer.Get(middleCeil));
        items.push(diamond);

        const fatherPointManager =new FartestPointsFinder();
        var hqPoints = fatherPointManager.GetPoints(fatherPointManager.GetFartestPoints(middleCeil,middleAreas),3);

        const redQuarter = new Headquarter(
            new HqSkin(Archive.team.red.tank, Archive.team.red.turrel,Archive.team.red.truck, Archive.team.red.hq, "redCeil"), 
            PlaygroundHelper.CeilsContainer.Get(hqPoints[0]));
        PlaygroundHelper.PlayerHeadquarter = redQuarter;        
        this._currentHq = redQuarter;
        
        const blueCeil = PlaygroundHelper.CeilsContainer.Get(hqPoints[1]);
        const blueQuarter = new IaHeadquarter(PlaygroundHelper.GetAreas(blueCeil)
        , new HqSkin(Archive.team.blue.tank, 
            Archive.team.blue.turrel,
            Archive.team.blue.truck, 
            Archive.team.blue.hq, 
            "selectedCeil"), 
            blueCeil);
        blueQuarter.Diamond = diamond;
        
        const brownCeil = PlaygroundHelper.CeilsContainer.Get(hqPoints[2]);
        const brownQuarter = new IaHeadquarter(PlaygroundHelper.GetAreas(brownCeil)
        , new HqSkin(Archive.team.yellow.tank
            , Archive.team.yellow.turrel
            ,Archive.team.yellow.truck
            , Archive.team.yellow.hq
            , "brownCeil")
        , brownCeil);
        brownQuarter.Diamond = diamond;
        
        items.push(redQuarter);
        items.push(blueQuarter);
        items.push(brownQuarter);
        
        this.SetMenus(redQuarter, items);
        ceils.forEach(ceil=>{
            CeilDecorator.Decorate(items, ceil);
            ceil.SetSprite();
        });
        items.forEach(item => {
            PlaygroundHelper.Render.Add(item);
        });
        items.push(new Cloud(200, 12 * PlaygroundHelper.Settings.Size, 600, 'cloud'));
        items.push(new Cloud(60, 12 * PlaygroundHelper.Settings.Size, 200, 'cloud2'));
        items.push(new Cloud(0, 12 * PlaygroundHelper.Settings.Size, 800, 'cloud3'));

        redQuarter.GetCurrentCeil().SetState(CeilState.Visible);
        redQuarter.GetCurrentCeil().GetAllNeighbourhood().forEach(ceil => {
            (<Ceil>ceil).SetState(CeilState.Visible);
        });

        return items;
    }

    private SetGrass(middleAreas: HexAxial[], items: Item[]) {
        middleAreas.forEach(corner => {
            const ceil = PlaygroundHelper.CeilsContainer.Get(corner);
            const boundingBox = new BoundingBox();
            boundingBox.Width = PlaygroundHelper.Settings.Size * 6;
            boundingBox.Height = PlaygroundHelper.Settings.Size * 6;
            boundingBox.X = ceil.GetBoundingBox().X - (boundingBox.Width / 2 - ceil.GetBoundingBox().Width / 2);
            boundingBox.Y = ceil.GetBoundingBox().Y - (boundingBox.Height / 2 - ceil.GetBoundingBox().Height / 2);
            const grass = new BasicItem(boundingBox, Archive.nature.grass);
            grass.SetDisplayTrigger(() => true);
            grass.SetVisible(() => true);
            items.push(grass);
        });
    }

    private SetMenus(redQuarter: Headquarter, items: Item[]) {
        const rightMenu = new LeftMenu((data:ISelectable)=>data instanceof Headquarter,
        [new EmptyMenuItem(Archive.menu.topMenu),
        new TankMenuItem(redQuarter),
        new TruckMenuItem(redQuarter),
        new CancelMenuItem(),
        new EmptyMenuItem(Archive.menu.bottomMenu)]);

        items.splice(0, 0, rightMenu);

        const zoomMenu = new TopMenu((data:ISelectable)=>true,
        [
            new ZoomInButton(),
            new ZoomOutButton(),
            new ShowEnemiesMenuItem()
        ]);
        zoomMenu.Show(null);
        items.splice(0, 0, zoomMenu);

        const leftMenu = new LeftMenu((data:ISelectable)=>data instanceof Vehicle,[new EmptyMenuItem(Archive.menu.topMenu),
        new TargetMenuItem(),
        new PatrolMenuItem(),
        new CancelMenuItem(),
        new EmptyMenuItem(Archive.menu.bottomMenu)]);
        items.splice(0, 0, leftMenu);

        const leftMenu2 = new LeftMenu((data:ISelectable)=>data instanceof Ceil,[new EmptyMenuItem(Archive.menu.topMenu),
            new HealMenuItem(),
            new AttackMenuItem(),
            new SpeedFieldMenuItem(),
            new MoneyMenuItem(),
            new CancelMenuItem(),
            new EmptyMenuItem(Archive.menu.bottomMenu)]);
        items.splice(0, 0, leftMenu2);

        const bottomMenu = new TopBar(redQuarter);
        items.splice(0, 0, bottomMenu);

        this._menus.push(rightMenu);
        this._menus.push(leftMenu);
        this._menus.push(leftMenu2);
    }
}