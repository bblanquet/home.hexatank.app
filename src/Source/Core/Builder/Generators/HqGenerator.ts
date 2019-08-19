import { IaHeadquarter } from '../../Ia/Hq/IaHeadquarter';
import { HexAxial } from '../../Utils/Coordinates/HexAxial';
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { Item } from '../../Items/Item';
import { Ceil } from '../../Ceils/Ceil';
import { ToolBox } from '../../Items/Unit/Utils/ToolBox';
import { Headquarter } from '../../Ceils/Field/Headquarter';
import { HqSkin } from '../../Utils/HqSkin';
import { Archive } from '../../Utils/ResourceArchiver';
import { Diamond } from "../../Ceils/Field/Diamond"; 

export class HqGenerator{


    // public GetHq(hqCeils: Array<HexAxial>, items: Item[]) :Array<Headquarter>
    // {
    //     var hqs = new Array<Headquarter>();
    //     let forbiddenCeils = new Array<Ceil>();
    //     hqCeils.forEach(hqCeil=> {
    //         forbiddenCeils = forbiddenCeils.concat(PlaygroundHelper.GetFirstRangeAreas(PlaygroundHelper.CeilsContainer.Get(hqCeil)));
    //     });

    //     const redHq = PlaygroundHelper.CeilsContainer.Get(hqCeils[0]);
    //     const redRange = PlaygroundHelper.GetSecondRangeAreas(redHq).filter(c => forbiddenCeils.indexOf(c) === -1);

    //     const diamond = new Diamond(
    //         ToolBox.GetRandomElement(redRange)
    //     );
    //     const redQuarter = new Headquarter(new HqSkin(Archive.team.red.tank, Archive.team.red.turrel, Archive.team.red.truck, Archive.team.red.hq, "redCeil"), redHq);
    //     PlaygroundHelper.PlayerHeadquarter = redQuarter;
    //     hqs.push(redQuarter);
    //     items.push(redQuarter);
    //     items.push(diamond);

    //     const blueCeil = PlaygroundHelper.CeilsContainer.Get(hqCeils[1]);
    //     const blueRangeAreas = PlaygroundHelper.GetSecondRangeAreas(blueCeil).filter(c => forbiddenCeils.indexOf(c) === -1);
    //     const blueDiamond = new Diamond(
    //         ToolBox.GetRandomElement(blueRangeAreas)
    //         );
    //     const blueQuarter = new IaHeadquarter(PlaygroundHelper.GetAreas(blueCeil), new HqSkin(Archive.team.blue.tank, Archive.team.blue.turrel, Archive.team.blue.truck, Archive.team.blue.hq, "selectedCeil"), blueCeil);
    //     blueQuarter.Diamond = blueDiamond;
    //     hqs.push(blueQuarter);
    //     items.push(blueDiamond);
    //     items.push(blueQuarter);
        
    //     const brownCeil = PlaygroundHelper.CeilsContainer.Get(hqCeils[2]);
    //     const brownRangeAreas = PlaygroundHelper.GetSecondRangeAreas(brownCeil).filter(c => redRange.indexOf(c) === -1).filter(c => forbiddenCeils.indexOf(c) === -1);
    //     const brownDiamond = new Diamond(
    //         ToolBox.GetRandomElement(brownRangeAreas)
    //         );
    //     const brownQuarter = new IaHeadquarter(PlaygroundHelper.GetAreas(brownCeil), new HqSkin(Archive.team.yellow.tank, Archive.team.yellow.turrel, Archive.team.yellow.truck, Archive.team.yellow.hq, "brownCeil"), brownCeil);
    //     brownQuarter.Diamond = brownDiamond;
    //     hqs.push(brownQuarter);
    //     items.push(brownDiamond);
    //     items.push(brownQuarter);

    //     return hqs;
    // }

    public GetHq(hqCeils: Array<HexAxial>, items: Item[]) :Array<Headquarter>
    {
        var hqs = new Array<Headquarter>();
        let forbiddenCeils = new Array<Ceil>();
        hqCeils.forEach(hqCeil=> {
            forbiddenCeils = forbiddenCeils.concat(PlaygroundHelper.GetFirstRangeAreas(PlaygroundHelper.CeilsContainer.Get(hqCeil)));
        });

        hqs.push(this.CreateHq(hqCeils[0], 
            forbiddenCeils, 
            items,
            this.RedSkin()));

        hqs.push(this.CreateIaHq(hqCeils[1], 
            forbiddenCeils, 
            items,
            this.BlueSkin()));

        hqs.push(this.CreateIaHq(hqCeils[2], 
            forbiddenCeils, 
            items,
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

    private CreateHq(hqCeil: HexAxial, forbiddenCeils: Ceil[], items: Item[], skin:HqSkin):Headquarter {
        const ceil = PlaygroundHelper.CeilsContainer.Get(hqCeil);
        const secondRange = 
        PlaygroundHelper.GetSecondRangeAreas(ceil).filter(c => forbiddenCeils.indexOf(c) === -1);
        const diamond = new Diamond(ToolBox.GetRandomElement(secondRange));
        const hq = new Headquarter(skin, ceil);
        items.push(diamond);
        items.push(hq);
        secondRange.forEach(c=>{
            forbiddenCeils.push(c);
        });
        return hq;
    }

    private CreateIaHq(hqCeil: HexAxial, forbiddenCeils: Ceil[], items: Item[], skin:HqSkin):Headquarter{
        const ceil = PlaygroundHelper.CeilsContainer.Get(hqCeil);
        const secondRange = 
        PlaygroundHelper.GetSecondRangeAreas(ceil).filter(c => forbiddenCeils.indexOf(c) === -1);
        const diamond = new Diamond(ToolBox.GetRandomElement(secondRange));
        const hq = new IaHeadquarter(PlaygroundHelper.GetAreas(ceil), skin, ceil);
        hq.Diamond = diamond;
        items.push(diamond);
        items.push(hq);
        secondRange.forEach(c=>{
            forbiddenCeils.push(c);
        });
        return hq;
    }
}