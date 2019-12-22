import { SandDecorator } from './../../Ceils/Decorator/SandDecorator';
import { MapMode } from './MapMode';
import { HexAxial } from './../../Utils/Coordinates/HexAxial';
import { AreaEngine } from './../../Ia/Area/AreaEngine';
import { CeilProperties } from './../../Ceils/CeilProperties';
import { ForestDecorator } from '../../Ceils/Decorator/ForestDecorator';
import { ToolBox } from '../../Items/Unit/Utils/ToolBox';
import { CeilsContainer } from '../../Ceils/CeilsContainer';
import { MapContext } from './MapContext';
import { MapItem } from './MapItem';
import { FlowerMapBuilder } from '../Builder/FlowerMapBuilder';
import { FartestPointsFinder } from '../Builder/FartestPointsFinder';
import { DecorationType } from './DecorationType';
import { DiamondHq } from './DiamondHq';
import { Decorator } from '../../Ceils/Decorator/Decorator';

export class MapGenerator
{
    public GetMapDefinition(hqCount:number, mapMode:MapMode):MapContext
    {
        const size = 20;
        const context = new MapContext();
        context.MapMode = mapMode;
        const mapItems = new Array<MapItem>();
        const mapBuilder = new FlowerMapBuilder();
        const ceilPositions = mapBuilder.Build(size);
        
        const container = new CeilsContainer<CeilProperties>();
        ceilPositions.forEach(ceil => {
            container.Add(ceil);
        });

        const center = mapBuilder.GetMidle(size);
        const areas = mapBuilder.GetAreaMiddleCeil(size);
        const fatherPointManager = new FartestPointsFinder();

        const hqPositions = fatherPointManager.GetPoints(fatherPointManager.GetFartestPoints(center, areas), hqCount);
        const diamondPositions = this.GetDiamonds(hqPositions.map(s=> new CeilProperties(s)),container,hqCount);
        
        const excluded = new Array<HexAxial>();
        let hqs = new Array<MapItem>();
        //add hqs
        hqPositions.forEach(hq=>{
            let hqMapItem = new MapItem();
            hqMapItem.Position = hq;
            hqMapItem.Type = DecorationType.Hq;
            mapItems.push(hqMapItem);
            excluded.push(hq);
            container.GetNeighbourhood(hq).forEach(p=>
            {
                excluded.push(p.GetCoordinate());
            });
            hqs.push(hqMapItem);
        });

        context.Hqs = new Array<DiamondHq>();
        //add diamonds and join them to hq
        diamondPositions.forEach(diamond=>{
            let diamonMapItem = new MapItem();
            diamonMapItem.Position = diamond.GetCoordinate();
            diamonMapItem.Type = DecorationType.Hq;
            mapItems.push(diamonMapItem);
            excluded.push(diamond.GetCoordinate());
            container.GetNeighbourhood(diamond.GetCoordinate()).forEach(p=>
            {
                excluded.push(p.GetCoordinate());
            });
            let hqDiamond = new DiamondHq();
            hqDiamond.Diamond = diamonMapItem;
            hqDiamond.Hq = hqs[diamondPositions.indexOf(diamond)];
            context.Hqs.push(hqDiamond);
        });


        var decorator:Decorator=null;
        if(mapMode === MapMode.forest){
            decorator = new ForestDecorator();
        }
        else
        {
            decorator = new SandDecorator();
        }
        //decorate tree, water, stone the map
        ceilPositions.forEach(ceilPosition => {
            let mapItem = new MapItem();
            mapItem.Position = ceilPosition.Coordinate;
            if(excluded.indexOf(ceilPosition.Coordinate) === -1){
                mapItem.Type = decorator.GetDecoration();
            }
            else
            {
                mapItem.Type = DecorationType.None;
            }

            if(mapItems.filter(mi=>mi.Position.ToString() === mapItem.Position.ToString()).length === 0){
                mapItems.push(mapItem);
            }

        });

        context.Items = mapItems;
        context.CenterItem = mapItems.filter(m=>m.Position.Q === center.Q && m.Position.R === center.R)[0];
        return context;
    }

    private GetDiamonds(hqCeils: Array<CeilProperties>,ceilsContainer:CeilsContainer<CeilProperties>, hqCount:number):Array<CeilProperties>
    {
        const diamonds = new Array<CeilProperties>();
        const areaEngine = new AreaEngine<CeilProperties>();
        let forbiddenCeils = new Array<CeilProperties>();
        hqCeils.forEach(hqCeil=> {
            forbiddenCeils = forbiddenCeils.concat(areaEngine.GetFirstRange(ceilsContainer,hqCeil));
        });
        for(let i = 0; i < hqCount;i++){
            diamonds.push(this.GetDiamondPosition(hqCeils[i], forbiddenCeils,ceilsContainer));
        }
        return diamonds;
    }


    private GetDiamondPosition(ceil: CeilProperties, forbiddenCeils: CeilProperties[],ceilsContainer:CeilsContainer<CeilProperties>):CeilProperties 
    {
        const areaEngine = new AreaEngine<CeilProperties>();
        const secondRange = areaEngine.GetSecondRangeAreas(ceilsContainer,ceil)
        .filter(c => !forbiddenCeils.some(fc=>fc.Coordinate.Q == c.Coordinate.Q && fc.Coordinate.R == c.Coordinate.R));
        var result = ToolBox.GetRandomElement(secondRange);
        secondRange.forEach(c=>{
            forbiddenCeils.push(c);
        });
        return result;
    }
}