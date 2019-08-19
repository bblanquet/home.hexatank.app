import { MapEntity } from './MapEntity';
import { IMapGenerator } from "./IMapGenerator";
import { CeilDecorator } from "../../Ceils/CeilDecorator";
import { Cloud } from "../../Items/Others/Cloud";
import { FlowerMapBuilder } from "../FlowerMapBuilder";
import { BasicItem } from "../../Items/BasicItem";
import { BoundingBox } from "../../Utils/BoundingBox"; 
import {Archive} from "../../Utils/ResourceArchiver"
import { HexAxial } from "../../Utils/Coordinates/HexAxial";
import { FartestPointsFinder } from "../FartestPointsFinder";
import { Item } from "../../Items/Item";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { Ceil } from '../../Ceils/Ceil';

export class MapGenerator
{
    public GetEmptyMap(hqCount:number):MapEntity
    {
        const items = new Array<Item>();
        const mapEntity = this.CreateCeils(items);
        const fatherPointManager = new FartestPointsFinder();
        mapEntity.Hqs = fatherPointManager.GetPoints(fatherPointManager.GetFartestPoints(mapEntity.Center, mapEntity.Areas), hqCount);
        mapEntity.items = items;
        return mapEntity;
    }

    public InitialiseCeils(ceils:Ceil[],items:Item[]):void{
        ceils.forEach(ceil=>{
            CeilDecorator.Decorate(items, ceil);
            ceil.SetSprite();
        });
    }

    public AddClouds(items: Item[]) {
        items.push(new Cloud(200, 20 * PlaygroundHelper.Settings.Size, 800, Archive.nature.clouds[0]));
        items.push(new Cloud(400, 20 * PlaygroundHelper.Settings.Size, 1200, Archive.nature.clouds[1]));
        items.push(new Cloud(600, 20 * PlaygroundHelper.Settings.Size, 1600, Archive.nature.clouds[2]));
        items.push(new Cloud(800, 20 * PlaygroundHelper.Settings.Size, 800, Archive.nature.clouds[3]));
        items.push(new Cloud(1200, 20 * PlaygroundHelper.Settings.Size, 1600, Archive.nature.clouds[4]));
    }

    private CreateCeils(items: Item[]):MapEntity {
        const size = 20;
        const mapBuilder = new FlowerMapBuilder();
        const ceils = mapBuilder.Build(size);
        ceils.forEach(ceil => {
            PlaygroundHelper.CeilsContainer.Add(ceil);
            items.push(ceil);
        });
        const areas = mapBuilder.GetAreaMiddleCeil(size);
        PlaygroundHelper.Settings.MapSize = areas.length * 6;
        const center = mapBuilder.GetMidle(size);
        areas.push(mapBuilder.GetMidle(size));
        this.SetGrass(areas, items);
        let mapEntity = new MapEntity();
        mapEntity.Areas = areas;
        mapEntity.Ceils = ceils;
        mapEntity.Center = center;
        return mapEntity;
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


}