import { IMapGenerator } from "./IMapGenerator";
import { Diamond } from "../Ceils/Field/Diamond";
import { Item } from "../Item";
import { CeilDecorator } from "../Ceils/CeilDecorator";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Headquarter } from "../Ceils/Field/Headquarter";
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
import { Ceil } from "../Ceils/Ceil";
import { TopMenu } from "../Menu/TopMenu";
import { MoneyMenuItem } from "../Menu/MoneyMenuItem";
import { CeilState } from "../Ceils/CeilState"; 
import { ShowEnemiesMenuItem } from "../Menu/ShowEnemiesMenuItem";
import { HexAxial } from "../Coordinates/HexAxial";
import { FartestPointsFinder } from "./FartestPointsFinder";
import { ToolBox } from "../Unit/Utils/ToolBox";
import { PauseButton } from "../Menu/PauseButton";
import { ResetButton } from "../Menu/ResetButton";

export class MapGenerator implements IMapGenerator{

    private _currentHq:Headquarter;
    private _menus:Menu[]=[];

    public GetHq():Headquarter{
        return this._currentHq;
    }

    public GetMenus(): Menu[] {
        return this._menus;
    }

    public SetMap():Array<Item>
    {
        const items = new Array<Item>();
        const { middleCeil, middleAreas, ceils } = this.CreateCeils(items);

        const fatherPointManager = new FartestPointsFinder();
        var hqCeils = fatherPointManager.GetPoints(fatherPointManager.GetFartestPoints(middleCeil, middleAreas), 3);
        const userHq = this.SetHqs(hqCeils, items);
        
        this.SetMenus(userHq, items);

        ceils.forEach(ceil=>{
            CeilDecorator.Decorate(items, ceil);
            ceil.SetSprite();
        });

        items.forEach(item => {
            PlaygroundHelper.Render.Add(item);
        });

        this.SetClouds(items);

        userHq.GetCurrentCeil().SetState(CeilState.Visible);
        userHq.GetCurrentCeil().GetAllNeighbourhood().forEach(ceil => {
            (<Ceil>ceil).SetState(CeilState.Visible);
        });

        return items;
    }

    private SetClouds(items: Item[]) {
        items.push(new Cloud(200, 20 * PlaygroundHelper.Settings.Size, 800, Archive.nature.clouds[0]));
        items.push(new Cloud(400, 20 * PlaygroundHelper.Settings.Size, 1200, Archive.nature.clouds[1]));
        items.push(new Cloud(600, 20 * PlaygroundHelper.Settings.Size, 1600, Archive.nature.clouds[2]));
        items.push(new Cloud(800, 20 * PlaygroundHelper.Settings.Size, 800, Archive.nature.clouds[3]));
        items.push(new Cloud(1200, 20 * PlaygroundHelper.Settings.Size, 1600, Archive.nature.clouds[4]));
    }

    private CreateCeils(items: Item[]) {
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
        return { middleCeil, middleAreas, ceils };
    }

    private SetHqs(hqCeils: Array<HexAxial>, items: Item[]) 
    {
        let forbiddenCeils = new Array<Ceil>();
        hqCeils.forEach(hqCeil=> {
            forbiddenCeils = forbiddenCeils.concat(PlaygroundHelper.GetFirstRangeAreas(PlaygroundHelper.CeilsContainer.Get(hqCeil)));
        });

        const redHq = PlaygroundHelper.CeilsContainer.Get(hqCeils[0]);
        const redRange = PlaygroundHelper.GetSecondRangeAreas(redHq).filter(c => forbiddenCeils.indexOf(c) === -1);

        const diamond = new Diamond(
            ToolBox.GetRandomElement(redRange)
        );
        const redQuarter = new Headquarter(new HqSkin(Archive.team.red.tank, Archive.team.red.turrel, Archive.team.red.truck, Archive.team.red.hq, "redCeil"), redHq);
        PlaygroundHelper.PlayerHeadquarter = redQuarter;
        this._currentHq = redQuarter;
        items.push(redQuarter);
        items.push(diamond);

        const blueCeil = PlaygroundHelper.CeilsContainer.Get(hqCeils[1]);
        const blueRangeAreas = PlaygroundHelper.GetSecondRangeAreas(blueCeil).filter(c => forbiddenCeils.indexOf(c) === -1);
        const blueDiamond = new Diamond(
            ToolBox.GetRandomElement(blueRangeAreas)
            );
        const blueQuarter = new IaHeadquarter(PlaygroundHelper.GetAreas(blueCeil), new HqSkin(Archive.team.blue.tank, Archive.team.blue.turrel, Archive.team.blue.truck, Archive.team.blue.hq, "selectedCeil"), blueCeil);
        blueQuarter.Diamond = blueDiamond;
        items.push(blueDiamond);
        items.push(blueQuarter);
        
        const brownCeil = PlaygroundHelper.CeilsContainer.Get(hqCeils[2]);
        const brownRangeAreas = PlaygroundHelper.GetSecondRangeAreas(brownCeil).filter(c => redRange.indexOf(c) === -1).filter(c => forbiddenCeils.indexOf(c) === -1);
        const brownDiamond = new Diamond(
            ToolBox.GetRandomElement(brownRangeAreas)
            );
        const brownQuarter = new IaHeadquarter(PlaygroundHelper.GetAreas(brownCeil), new HqSkin(Archive.team.yellow.tank, Archive.team.yellow.turrel, Archive.team.yellow.truck, Archive.team.yellow.hq, "brownCeil"), brownCeil);
        brownQuarter.Diamond = brownDiamond;
        items.push(brownDiamond);
        items.push(brownQuarter);

        return redQuarter;
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
            new PauseButton(),
            new ShowEnemiesMenuItem(),
            new ResetButton()
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