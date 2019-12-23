import { PersistentOrder } from '../Ia/Order/PersistentOrder';
import { Cell } from '../Cell/Cell';      
import { Vehicle } from '../Items/Unit/Vehicle';
import { isNullOrUndefined } from 'util';

export class MultiSelectionHandler
{
    public GiveOrders(vehicles:Vehicle[], selectedCells:Cell[])
    {
        selectedCells = selectedCells.filter(c=>!c.IsBlocked());
        if(selectedCells.length < vehicles.length)
        {
            for (let index = 0; index < vehicles.length; index++) {
                let modulo = index%selectedCells.length;
                vehicles[index].SetOrder(new PersistentOrder(selectedCells[modulo],vehicles[index]));
            }
        }
        else if(vehicles.length < selectedCells.length)
        {
            let cells = new Array<Cell>();
            this.GetSubList(selectedCells,vehicles.length,cells);
            this.SetPaths(vehicles, cells);
        }
        else
        {
            this.SetPaths(vehicles, selectedCells);
        }
    }

    private SetPaths(vehicles: Vehicle[], selectedCells: Cell[]) {
        let pathsVehicleList = this.GetVehiclePathsList(vehicles, selectedCells);
        for (let index = 0; index < pathsVehicleList.length; index++) {
            let cell = pathsVehicleList[index].Pop();
            pathsVehicleList[index].GetVehicle().SetOrder(new PersistentOrder(cell, vehicles[index]));
            pathsVehicleList.forEach(pathVehicle => {
                pathVehicle.Remove(cell.GetCoordinate().ToString());
            });
        }
    }

    public GetSubList(cells:Cell[],threshold:number, result:Cell[]):void{
        if(result.length < threshold){
            let first = new Array<Cell>();
            let second = new Array<Cell>();
            result.push(this.Split(cells,first,second));
            if(0<first.length){
                this.GetSubList(first,threshold,result);
            }
            if(0<second.length){
                this.GetSubList(second,threshold,result);
            }
        }
    }

    public Split(rawList:Cell[], firstList:Cell[],secondList:Cell[]):Cell{
        var middle = Math.floor(rawList.length/2);
        for (let index = 0; index < middle; index++) {
            firstList.push(rawList[index]);
        }
        for (let index = middle+1; index < rawList.length; index++) {
            secondList.push(rawList[index]);
        }

        let result = rawList[middle];
        if(isNullOrUndefined(result)){
            throw "wrong split";
        }
        return result;
    }

    private GetVehiclePathsList(vehicles:Vehicle[], cells:Cell[]):VehiclePaths[]{
        let result = new Array<VehiclePaths>();
        vehicles.forEach(vehicle => {
            let vp = new VehiclePaths(vehicle);
            cells.forEach(cell => {
                vp.Add(cell);
            });
            result.push(vp);
        });
        return result;
    }


}

export class VehiclePaths {
    private _cells:Array<Cell>; 

    constructor(private _vehicle:Vehicle){
        this._cells = new Array<Cell>();
    }

    public GetVehicle():Vehicle{
        return this._vehicle;
    }

    public Add(cell:Cell){
        if(this._cells.length === 0){
            this._cells.push(cell)
        }else{
            let distance = cell.GetBoundingBox().GetCentralPoint().GetDistance(this._vehicle.GetBoundingBox().GetCentralPoint());
            for (let index = 0; index < this._cells.length; index++) {
                let currentDistance = 
                this._cells[index].GetBoundingBox().GetCentralPoint().GetDistance(this._vehicle.GetBoundingBox().GetCentralPoint());
                if(distance < currentDistance){
                    this._cells.splice(index,0,cell);
                    return;
                }
            }
            this._cells.push(cell);
        }
    }

    public Pop():Cell{
        const cell = this._cells[0];
        this._cells.splice(0, 1);
        return cell;        
    }

    public Remove(pos:string):void{
        this._cells = this._cells.filter(c=>c.GetCoordinate().ToString() !== pos);
    }

}