import { HeldArea } from "./HeldArea";

export class AreaStatus{

    public constructor(
        public OutsideEnemies:number,
        public InsideEnemies:number,
        public InsideTroops:number,   
        public OutsideTroops:number,
        public Area:HeldArea
    ){
    }

    public GetTotalEnemies():number{
        return this.OutsideEnemies + this.InsideEnemies;
    }

    public HasOverTroops():boolean{
        return (this.GetTotalEnemies() == 0 && this.InsideTroops > 1)
        || (this.InsideEnemies == 0 && this.OutsideEnemies < this.InsideTroops+2);
    }

    public GetExcessTroops():number{ 
        if(this.GetTotalEnemies() == 0 && this.InsideTroops > 1)
        {
            return this.InsideTroops - 1;
        }
        else if(this.InsideEnemies == 0 && this.OutsideEnemies < this.InsideTroops+2)
        {
            return this.InsideTroops-2;
        }
        return 0;
    }
}