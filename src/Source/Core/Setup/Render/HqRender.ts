import { IaHeadquarter } from '../../Ia/Hq/IaHeadquarter';
import { HexAxial } from '../../Utils/Coordinates/HexAxial';
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { Item } from '../../Items/Item';
import { Headquarter } from '../../Ceils/Field/Headquarter';
import { HqSkin } from '../../Utils/HqSkin'; 
import { Archive } from '../../Utils/ResourceArchiver';
import { Diamond } from "../../Ceils/Field/Diamond"; 
import { DiamondHq } from '../Generator/DiamondHq';

export class HqRender{

    public GetHq(player: DiamondHq, others: Array<DiamondHq>, playgroundItems:Item[]) :Array<Headquarter>
    {
        var hqs = new Array<Headquarter>();

        hqs.push(this.CreateHq(
            player.Hq.Position,
            player.Diamond.Position, 
            playgroundItems,
            this.RedSkin()));

        hqs.push(this.CreateIaHq(others[1].Hq.Position,others[1].Diamond.Position, 
            playgroundItems,
            this.BlueSkin()));

        hqs.push(this.CreateIaHq(others[2].Hq.Position,others[2].Diamond.Position, 
            playgroundItems,
            this.BrownSkin()));
     
        return hqs;
    }

    private RedSkin(): HqSkin {
        return new HqSkin(Archive.team.red.tank, Archive.team.red.turrel, Archive.team.red.truck, Archive.team.red.hq, "redCeil");
    }

    private BlueSkin(): HqSkin {
        return new HqSkin(Archive.team.blue.tank, Archive.team.blue.turrel, Archive.team.blue.truck, Archive.team.blue.hq, "selectedCeil");
    }

    private BrownSkin(): HqSkin {
        return new HqSkin(Archive.team.yellow.tank, Archive.team.yellow.turrel, Archive.team.yellow.truck, Archive.team.yellow.hq, "brownCeil");
    }

    private CreateHq(hqCeil: HexAxial,diamondCeil: HexAxial, items: Item[], skin:HqSkin):Headquarter {
        const diamond = new Diamond(PlaygroundHelper.CeilsContainer.Get(diamondCeil));
        const hq = new Headquarter(skin, PlaygroundHelper.CeilsContainer.Get(hqCeil));
        items.push(diamond);
        items.push(hq);
        return hq;
    }

    private CreateIaHq(hqCeil: HexAxial, diamondCeil: HexAxial, items: Item[], skin:HqSkin):Headquarter{
        const ceil = PlaygroundHelper.CeilsContainer.Get(hqCeil);
        const diamond = new Diamond(PlaygroundHelper.CeilsContainer.Get(diamondCeil));
        const hq = new IaHeadquarter(PlaygroundHelper.GetAreas(ceil), skin, ceil);
        hq.Diamond = diamond;
        items.push(diamond);
        items.push(hq);
        return hq;
    }
}