import { PlaygroundBuilder } from "./Source/PlaygroundBuilder";
import { Ceil } from "./Source/Ceil";
import { Diamond } from "./Source/Field/Diamond";
import { Headquarter } from "./Source/Field/Headquarter";
import { SmartHq } from "./Source/Ia/SmartHq";
import { PlaygroundHelper } from "./Source/PlaygroundHelper";
import { HqSkin } from "./Source/HqSkin";
import { RightMenu } from "./Source/Menu/RightMenu";
import { EmptyMenuItem } from "./Source/Menu/EmptyMenuItem";
import { TankMenuItem } from "./Source/Menu/TankMenuItem";
import { TruckMenuItem } from "./Source/Menu/TruckMenuItem";
import { HealMenuItem } from "./Source/Menu/HealMenuItem";
import { AttackMenuItem } from "./Source/Menu/AttackMenuItem";
import { SpeedFieldMenuItem } from "./Source/Menu/SpeedFieldMenuItem";
import { LeftMenu } from "./Source/Menu/LeftMenu";
import { PatrolMenuItem } from "./Source/Menu/PatrolMenuItem";
import { CancelMenuItem } from "./Source/Menu/CancelMenuItem";
import { BottomMenu } from "./Source/Menu/BottomMenu";
import { Cloud } from "./Source/Cloud";
import { Playground } from "./Source/Playground";
import { CeilDecorator } from "./Source/CeilDecorator";
import { Item } from "./Source/Item";

export class GameSetup{
    SetMap():void
    {
        let items = new Array<Item>();
        let playgroundMaker = new PlaygroundBuilder(6);
        var ceils = playgroundMaker.Build();
        ceils.forEach(ceil=>
        {
            CeilDecorator.Decorate(items, ceil);
            ceil.SetSprite();
            PlaygroundHelper.CeilsContainer.Add(ceil);
            items.push(ceil);
        });        
        
        let diamond = new Diamond(<Ceil> ceils[15]);
        items.push(diamond);

        var redQuarter = new Headquarter(new HqSkin("redBottomTank","redTopTank","redTruck","redHqLight","redCeil"),(<Ceil> ceils[40]));
        var blueQuarter = new SmartHq(PlaygroundHelper.GetAreas(<Ceil> ceils[60]),
        new HqSkin("blueBottomTank","blueTopTank","blueTruck","blueHqLight","selectedCeil"),(<Ceil> ceils[60]));
        blueQuarter.Diamond = diamond;

        var brownQuarter = new SmartHq(PlaygroundHelper.GetAreas(<Ceil> ceils[75])
        ,new HqSkin("brownBottomTank","brownTopTank","brownTruck","brownHqLight","brownCeil"),(<Ceil> ceils[75]));
        brownQuarter.Diamond = diamond;

        items.push(redQuarter);
        items.push(blueQuarter);
        items.push(brownQuarter);

        var rightMenu = new RightMenu(
            [new EmptyMenuItem('rightTopBorder','rightTopBorder'),
            new TankMenuItem(redQuarter),
            new TruckMenuItem(redQuarter),
            new HealMenuItem(),
            new AttackMenuItem(),
            new SpeedFieldMenuItem(),
            new EmptyMenuItem('rightBottomBorder','rightBottomBorder')]);    
        items.splice(0,0,rightMenu);

        var leftMenu = new LeftMenu(
            [new EmptyMenuItem('leftTopBorder','leftTopBorder'),
            new EmptyMenuItem('attackIcon','hoverAttackIcon'),
            new EmptyMenuItem('defenseIcon','hoverDefenseIcon'),
            new PatrolMenuItem(),
            new CancelMenuItem(),
            new EmptyMenuItem('leftBottomBorder','leftBottomBorder')]);

        items.splice(0,0,leftMenu);
        
        var bottomMenu = new BottomMenu(redQuarter);

        items.splice(0,0,bottomMenu);

        items.forEach(item=>{
            PlaygroundHelper.Render.Add(item);
        });
        
        items.push(new Cloud(200,12*PlaygroundHelper.Settings.Size,600,'cloud'));
        items.push(new Cloud(60,12*PlaygroundHelper.Settings.Size,200,'cloud2'));
        items.push(new Cloud(0,12*PlaygroundHelper.Settings.Size,800,'cloud3'));

        let playground = new Playground(items);
        PlaygroundHelper.Playground = playground;
    }
}