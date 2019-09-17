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

    _skins:HqSkin[]=[
        new HqSkin(Archive.team.red.tank, Archive.team.red.turrel, Archive.team.red.truck, Archive.team.red.hq, Archive.building.hq.red.field),
        new HqSkin(Archive.team.blue.tank, Archive.team.blue.turrel, Archive.team.blue.truck, Archive.team.blue.hq, Archive.building.hq.blue.field),
        new HqSkin(Archive.team.yellow.tank, Archive.team.yellow.turrel, Archive.team.yellow.truck, Archive.team.yellow.hq, Archive.building.hq.yellow.field)
    ]

    public GetHq(hqDefinitions: Array<DiamondHq>, playgroundItems:Item[]) :Array<Headquarter>
    {
        var hqs = new Array<Headquarter>();
        
        hqDefinitions.forEach(hqDefinition=>{
            let index = hqDefinitions.indexOf(hqDefinition);
            let hq = {};
            
            if(hqDefinition.isIa){
                hq = this.CreateIaHq(
                    hqDefinition.Hq.Position,
                    hqDefinition.Diamond.Position, 
                    playgroundItems,
                    this._skins[index]);
            }else{
                hq = this.CreateHq(
                    hqDefinition.Hq.Position,
                    hqDefinition.Diamond.Position, 
                    playgroundItems,
                    this._skins[index]);
            }

            if(hqDefinition.PlayerName){
                (<Headquarter>hq).PlayerName = hqDefinition.PlayerName; 
            }

            hqs.push(<Headquarter>hq);

        });
     
        return hqs;
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