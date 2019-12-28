import { GameSettings } from './../Utils/GameSettings';
import { PlaygroundHelper } from './../Utils/PlaygroundHelper';
import { Cell } from "./Cell";
import { CellState } from './CellState';

export class CellStateSetter{
    public static SetStates(cells:Array<Cell>):void{
        cells.forEach(cell=>this.SetState(cell));
    }
    
    public static SetState(cell:Cell):void{
        const territoty = PlaygroundHelper
        .PlayerHeadquarter
        .GetInfluence().map(f=>f.GetArea());

        let isContained = false;
        territoty.some(c=>isContained = c.Exist(cell.GetCoordinate()));

        if(isContained){
            cell.SetState(CellState.Visible);
        }
        else
        {
            if(GameSettings.ShowEnemies)
            {
                if(cell.HasAroundOccupier()){
                    cell.SetState(CellState.Visible);
                }
                else
                {
                    if(cell.GetState() !== CellState.Hidden){
                        cell.SetState(CellState.Mist);
                    } 
                }
            }
            else 
            {
                if(cell.HasAroundAlly(PlaygroundHelper.PlayerHeadquarter)){
                    cell.SetState(CellState.Visible);
                }
                else
                {
                    if(cell.GetState() !== CellState.Hidden){
                        cell.SetState(CellState.Mist);
                    } 
                }
            }
        }
    }
}