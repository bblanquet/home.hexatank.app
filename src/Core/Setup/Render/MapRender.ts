import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { ForestDecorator } from '../../Ceils/Decorator/ForestDecorator'; 
import { CeilProperties } from '../../Ceils/CeilProperties';
import { Cloud } from '../../Items/Others/Cloud'; 
import { HqRender } from './HqRender';
import { CeilState } from '../../Ceils/CeilState';
import { Ceil } from '../../Ceils/Ceil';
import { Item } from '../../Items/Item';
import { HexAxial } from '../../Utils/Coordinates/HexAxial';
import { BoundingBox } from '../../Utils/BoundingBox';
import { BasicItem } from '../../Items/BasicItem';
import { Archive } from '../../Utils/ResourceArchiver';  
import { MapContext } from '../Generator/MapContext'; 
import { MapMode } from '../Generator/MapMode';

export class MapRender{
    private _hqRender:HqRender;
    
    constructor(){
        this._hqRender = new HqRender();
    }

    Render(mapContext:MapContext):void{
        PlaygroundHelper.Init();
        PlaygroundHelper.Settings.MapSize = mapContext.Items.length;

        let playgroundItems = new Array<Item>();

        mapContext.Items.forEach(item =>{
            let ceil = new Ceil(new CeilProperties(item.Position));
            ForestDecorator.SetDecoration(playgroundItems,ceil,item.Type);
            ceil.SetSprite();
            PlaygroundHelper.CeilsContainer.Add(ceil);
            playgroundItems.push(ceil);
            PlaygroundHelper.CeilsContainer.Add(ceil);
        });

        let areas = PlaygroundHelper.GetAreas(PlaygroundHelper.CeilsContainer.Get(mapContext.CenterItem.Position));
        this.SetGrass(mapContext.MapMode, areas.map(a=>a.GetCentralCeil().GetCoordinate()), playgroundItems);
        this.AddClouds(playgroundItems);
        PlaygroundHelper.SetAppColor(mapContext.MapMode);
        const hqs = this._hqRender.GetHq(mapContext.Hqs,playgroundItems);

        let playerHq = hqs.find(hq=>hq.PlayerName === PlaygroundHelper.PlayerName);
        //Link menu to player HQ
        PlaygroundHelper.PlayerHeadquarter = playerHq;
        PlaygroundHelper.InteractionContext.SetCombination(playerHq);
        PlaygroundHelper.InteractionContext.Listen();

        //make hq ceils visible
        playerHq.GetCurrentCeil().SetState(CeilState.Visible);
        playerHq.GetCurrentCeil().GetAllNeighbourhood().forEach(ceil => {
            (<Ceil>ceil).SetState(CeilState.Visible);
        }); 

        //insert elements into playground
        playgroundItems.forEach(item => {
            PlaygroundHelper.Playground.Items.push(item);        
        });
    }

    public AddClouds(items: Item[]) {
        items.push(new Cloud(200, 20 * PlaygroundHelper.Settings.Size, 800, Archive.nature.clouds[0]));
        items.push(new Cloud(400, 20 * PlaygroundHelper.Settings.Size, 1200, Archive.nature.clouds[1]));
        items.push(new Cloud(600, 20 * PlaygroundHelper.Settings.Size, 1600, Archive.nature.clouds[2]));
        items.push(new Cloud(800, 20 * PlaygroundHelper.Settings.Size, 800, Archive.nature.clouds[3]));
        items.push(new Cloud(1200, 20 * PlaygroundHelper.Settings.Size, 1600, Archive.nature.clouds[4]));
    }

    private SetGrass(mode:MapMode,middleAreas: HexAxial[], items: Item[]) {
        middleAreas.forEach(corner => {
            const ceil = PlaygroundHelper.CeilsContainer.Get(corner);
            const boundingBox = new BoundingBox();
            boundingBox.Width = PlaygroundHelper.Settings.Size * 6;
            boundingBox.Height = PlaygroundHelper.Settings.Size * 6;
            boundingBox.X = ceil.GetBoundingBox().X - (boundingBox.Width / 2 - ceil.GetBoundingBox().Width / 2);
            boundingBox.Y = ceil.GetBoundingBox().Y - (boundingBox.Height / 2 - ceil.GetBoundingBox().Height / 2);
            const grass = new BasicItem(boundingBox, mode === MapMode.forest ? Archive.nature.grass : Archive.nature.sand );
            grass.SetVisible(() => true);
            grass.SetAlive(() => true);
            items.push(grass);
        });
    }
}