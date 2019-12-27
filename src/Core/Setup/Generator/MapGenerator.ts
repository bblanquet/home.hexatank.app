import { HexagonalMapBuilder } from './../Builder/HexagonalMapBuilder';
import { SandDecorator } from '../../Cell/Decorator/SandDecorator';
import { MapMode } from './MapMode';
import { HexAxial } from './../../Utils/Coordinates/HexAxial';
import { AreaEngine } from './../../Ia/Area/AreaEngine';
import { CellProperties } from '../../Cell/CellProperties';
import { ForestDecorator } from '../../Cell/Decorator/ForestDecorator';
import { ToolBox } from '../../Items/Unit/Utils/ToolBox';
import { CellContainer } from '../../Cell/CellContainer';
import { MapContext } from './MapContext';
import { MapItem } from './MapItem';
import { FlowerMapBuilder } from '../Builder/FlowerMapBuilder';
import { FartestPointsFinder } from '../Builder/FartestPointsFinder';
import { DecorationType } from './DecorationType';
import { DiamondHq } from './DiamondHq';
import { Decorator } from '../../Cell/Decorator/Decorator';

export class MapGenerator
{
    public GetMapDefinition(mapSize:number,mapType:string, hqCount:number, mapMode:MapMode):MapContext
    {
        const context = new MapContext();
        context.MapMode = mapMode;
        const mapItems = new Array<MapItem>();
        const mapBuilder = mapType === 'Flower' ? new FlowerMapBuilder():new HexagonalMapBuilder();
        const cellPositions = mapBuilder.Build(mapSize);
        
        const container = new CellContainer<CellProperties>();
        cellPositions.forEach(cell => {
            container.Add(cell);
        });

        const center = mapBuilder.GetMidle(mapSize);
        const areas = mapBuilder.GetAreaMiddlecell(mapSize);
        const fatherPointManager = new FartestPointsFinder();

        const hqPositions = fatherPointManager.GetPoints(fatherPointManager.GetFartestPoints(center, areas), hqCount);
        const diamondPositions = this.GetDiamonds(hqPositions.map(s=> new CellProperties(s)),container,hqCount);
        
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
        cellPositions.forEach(cellPosition => {
            let mapItem = new MapItem();
            mapItem.Position = cellPosition.Coordinate;
            if(excluded.indexOf(cellPosition.Coordinate) === -1){
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

    private GetDiamonds(hqcells: Array<CellProperties>,cellsContainer:CellContainer<CellProperties>, hqCount:number):Array<CellProperties>
    {
        const diamonds = new Array<CellProperties>();
        const areaEngine = new AreaEngine<CellProperties>();
        let forbiddencells = new Array<CellProperties>();
        hqcells.forEach(hqcell=> {
            forbiddencells = forbiddencells.concat(areaEngine.GetFirstRange(cellsContainer,hqcell));
        });
        for(let i = 0; i < hqCount;i++){
            diamonds.push(this.GetDiamondPosition(hqcells[i], forbiddencells,cellsContainer));
        }
        return diamonds;
    }


    private GetDiamondPosition(cell: CellProperties, forbiddencells: CellProperties[],cellsContainer:CellContainer<CellProperties>):CellProperties 
    {
        const areaEngine = new AreaEngine<CellProperties>();
        const secondRange = areaEngine.GetSecondRangeAreas(cellsContainer,cell)
        .filter(c => !forbiddencells.some(fc=>fc.Coordinate.Q == c.Coordinate.Q && fc.Coordinate.R == c.Coordinate.R));
        var result = ToolBox.GetRandomElement(secondRange);
        secondRange.forEach(c=>{
            forbiddencells.push(c);
        });
        return result;
    }
}