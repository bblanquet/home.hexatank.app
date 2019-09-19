import { Vehicle } from "./Vehicle";

export class VehiclesContainer{

    private Vehicles:{ [id: string]: Vehicle; }; 

    Add(vehicle:Vehicle):void{
        if(this.Vehicles == null)
        {
            this.Vehicles = {};
        }

        this.Vehicles[vehicle.Id] = vehicle; 
    }

    Get(id:string):Vehicle{
        return this.Vehicles[id];
    }

    public Exist(id: string):boolean {
        if(this.Vehicles == null)
        {
            this.Vehicles = {};
        }
        return id in this.Vehicles;
    }
}