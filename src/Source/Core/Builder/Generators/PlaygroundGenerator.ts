import { HqGenerator } from './HqGenerator';
import { MapGenerator } from './MapGenerator';
import { MenuGenerator } from './MenuGenerator';
import { CeilState } from '../../Ceils/CeilState';
import { Ceil } from '../../Ceils/Ceil';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper'; 
import { Playground } from '../../Playground';

export class PlaygroundGenerator{
    private _mapGenerator:MapGenerator;
    private _hqGenerator:HqGenerator;
    private _menuGenerator:MenuGenerator;
    
    constructor(){
        this._mapGenerator = new MapGenerator();
        this._hqGenerator = new HqGenerator();
        this._menuGenerator = new MenuGenerator();
    }

    Generate():void{
        PlaygroundHelper.Playground = new Playground();

        //define MAP
        let mapEntity = this._mapGenerator.GetEmptyMap(3);
        
        //generate HQ on MAP
        let hqs = this._hqGenerator.GetHq(mapEntity.Hqs,mapEntity.items);
        let playerHq = hqs[0];

        //Link menu to player HQ
        PlaygroundHelper.PlayerHeadquarter = playerHq;
        let menus = this._menuGenerator.GetMenus(playerHq,mapEntity.items);
        PlaygroundHelper.Playground.InputManager.InteractionContext.SetCombination(menus,playerHq);

        //add initialise forest and sea in map
        this._mapGenerator.InitialiseCeils(mapEntity.Ceils, mapEntity.items);

        this._mapGenerator.AddClouds(mapEntity.items);

        //make hq ceils visible
        playerHq.GetCurrentCeil().SetState(CeilState.Visible);
        playerHq.GetCurrentCeil().GetAllNeighbourhood().forEach(ceil => {
            (<Ceil>ceil).SetState(CeilState.Visible);
        }); 

        //insert elements into playground
        mapEntity.items.forEach(item => {
            PlaygroundHelper.Playground.Items.push(item);        
        });
    }
}