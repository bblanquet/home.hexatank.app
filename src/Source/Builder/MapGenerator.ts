import { IMapGenerator } from "./IMapGenerator";
import { Diamond } from "../Field/Diamond";
import { Item } from "../Item";
import { HexagonalMapBuilder } from "./HexagonalMapBuilder";
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
import { Ceil } from "../Ceil";
import { createInflate } from "zlib";

export class MapGenerator implements IMapGenerator{
    private _currentHq:Headquarter;

    public GetHq():Headquarter{
        return this._currentHq;
    }

    public SetMap():Array<Item>{
        const items = new Array<Item>();
        const mapLength = 12;
        const mapBuilder = new HexagonalMapBuilder();
        const ceils = mapBuilder.Build(mapLength);
        ceils.forEach(ceil => {
            PlaygroundHelper.CeilsContainer.Add(ceil);
            items.push(ceil);
        });
        const corners = mapBuilder.GetCorners(mapLength);

        const diamond = new Diamond(PlaygroundHelper.CeilsContainer.Get(mapBuilder.GetMidle(mapLength)));
        items.push(diamond);
        const redQuarter = new Headquarter(
            new HqSkin("./tank/bottomTank.svg", "./tank/topTank.svg", "redTruck", "redHqLight", "redCeil"), 
            PlaygroundHelper.CeilsContainer.Get(corners[0]));
        this._currentHq = redQuarter;
        const blueQuarter = new SmartHq(PlaygroundHelper.GetAreas(PlaygroundHelper.CeilsContainer.Get(corners[1]))
        , new HqSkin("blueBottomTank", "blueTopTank", "blueTruck", "blueHqLight", "selectedCeil"), 
        PlaygroundHelper.CeilsContainer.Get(corners[1]));
        blueQuarter.Diamond = diamond;
        const brownQuarter = new SmartHq(PlaygroundHelper.GetAreas(PlaygroundHelper.CeilsContainer.Get(corners[2]))
        , new HqSkin("brownBottomTank", "brownTopTank", "brownTruck", "brownHqLight", "brownCeil")
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
        const rightMenu = new RightMenu([new EmptyMenuItem('rightTopBorder', 'rightTopBorder'),
        new TankMenuItem(redQuarter),
        new TruckMenuItem(redQuarter),
        new HealMenuItem(),
        new AttackMenuItem(),
        new SpeedFieldMenuItem(),
        new EmptyMenuItem('rightBottomBorder', 'rightBottomBorder')]);
        items.splice(0, 0, rightMenu);
        const leftMenu = new LeftMenu([new EmptyMenuItem('leftTopBorder', 'leftTopBorder'),
        new EmptyMenuItem('attackIcon', 'hoverAttackIcon'),
        new EmptyMenuItem('defenseIcon', 'hoverDefenseIcon'),
        new PatrolMenuItem(),
        new CancelMenuItem(),
        new EmptyMenuItem('leftBottomBorder', 'leftBottomBorder')]);
        items.splice(0, 0, leftMenu);
        const bottomMenu = new BottomMenu(redQuarter);
        items.splice(0, 0, bottomMenu);
    }
}