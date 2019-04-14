import { IMapGenerator } from "./IMapGenerator";
import { Diamond } from "../Field/Diamond";
import { Item } from "../Item";
import { CeilDecorator } from "../CeilDecorator";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Headquarter } from "../Field/Headquarter";
import { HqSkin } from "../HqSkin";
import { SmartHq } from "../Ia/SmartHq";
import { Cloud } from "../Cloud";
import { RightMenu } from "../Menu/RightMenu";
import { EmptyMenuItem } from "../Menu/EmptyMenuItem";
import { TankMenuItem } from "../Menu/TankMenuItem";
import { TruckMenuItem } from "../Menu/TruckMenuItem";
import { HealMenuItem } from "../Menu/HealMenuItem";
import { AttackMenuItem } from "../Menu/AttackMenuItem";
import { SpeedFieldMenuItem } from "../Menu/SpeedFieldMenuItem";
import { LeftMenu } from "../Menu/LeftMenu";
import { PatrolMenuItem } from "../Menu/PatrolMenuItem";
import { CancelMenuItem } from "../Menu/CancelMenuItem";
import { BottomMenu } from "../Menu/BottomMenu";
import { FlowerMapBuilder } from "./FlowerMapBuilder";
import { BasicItem } from "../BasicItem";
import { BoundingBox } from "../BoundingBox";
import {Archive} from "../Tools/ResourceArchiver"
import { TargetMenuItem } from "../Menu/TargetMenuItem";

export class MapGenerator implements IMapGenerator{
    private _currentHq:Headquarter;

    public GetHq():Headquarter{
        return this._currentHq;
    }

    public SetMap():Array<Item>{
        const items = new Array<Item>();
        const mapLength = 12;
        const mapBuilder = new FlowerMapBuilder();
        const ceils = mapBuilder.Build(mapLength);
        ceils.forEach(ceil => {
            PlaygroundHelper.CeilsContainer.Add(ceil);
            items.push(ceil);
        });
        const corners = mapBuilder.GetCorners(mapLength);
        corners.push(mapBuilder.GetMidle(mapLength));
        corners.forEach(corner=>{
            const ceil = PlaygroundHelper.CeilsContainer.Get(corner);
            const b = new BoundingBox();
            b.Width = PlaygroundHelper.Settings.Size * 6;
            b.Height = PlaygroundHelper.Settings.Size * 6;
            b.X = ceil.GetBoundingBox().X - (b.Width/2 - ceil.GetBoundingBox().Width/2);
            b.Y = ceil.GetBoundingBox().Y - (b.Height/2 - ceil.GetBoundingBox().Height/2);
            const grass = new BasicItem(b,Archive.nature.grass);
            grass.SetDisplayTrigger(()=>true);
            grass.SetVisible(()=>true);
            items.push(grass);
        });
        const diamond = new Diamond(PlaygroundHelper.CeilsContainer.Get(mapBuilder.GetMidle(mapLength)));
        items.push(diamond);
        const redQuarter = new Headquarter(
            new HqSkin(Archive.team.red.tank, Archive.team.red.turrel,Archive.team.red.truck, Archive.team.red.hq, "redCeil"), 
            PlaygroundHelper.CeilsContainer.Get(corners[3]));
        this._currentHq = redQuarter;
        const blueQuarter = new SmartHq(PlaygroundHelper.GetAreas(PlaygroundHelper.CeilsContainer.Get(corners[1]))
        , new HqSkin(Archive.team.blue.tank, Archive.team.blue.turrel,Archive.team.blue.truck, Archive.team.blue.hq, "selectedCeil"), 
        PlaygroundHelper.CeilsContainer.Get(corners[1]));
        blueQuarter.Diamond = diamond;
        const brownQuarter = new SmartHq(PlaygroundHelper.GetAreas(PlaygroundHelper.CeilsContainer.Get(corners[2]))
        , new HqSkin(Archive.team.yellow.tank, Archive.team.yellow.turrel,Archive.team.yellow.truck, Archive.team.yellow.hq, "brownCeil")
        , PlaygroundHelper.CeilsContainer.Get(corners[2]));

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
        return items;
    }

    private SetMenus(redQuarter: Headquarter, items: Item[]) {
        const rightMenu = new RightMenu([new EmptyMenuItem('rightTopBorder'),
        new TankMenuItem(redQuarter),
        new TruckMenuItem(redQuarter),
        new EmptyMenuItem('rightBottomBorder')]);

        items.splice(0, 0, rightMenu);

        const leftMenu = new LeftMenu([new EmptyMenuItem(Archive.menu.topMenu),
        new TargetMenuItem(),
        new PatrolMenuItem(),
        new CancelMenuItem(),
        new EmptyMenuItem(Archive.menu.bottomMenu)]);
        items.splice(0, 0, leftMenu);

        const leftMenu2 = new LeftMenu([new EmptyMenuItem(Archive.menu.topMenu),
            new HealMenuItem(),
            new AttackMenuItem(),
            new SpeedFieldMenuItem(),
            new EmptyMenuItem(Archive.menu.bottomMenu)]);
        items.splice(0, 0, leftMenu2);

        const bottomMenu = new BottomMenu(redQuarter);
        items.splice(0, 0, bottomMenu);
    }
}