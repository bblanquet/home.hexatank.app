import { ITimer } from "./ITimer";

export class Timer implements ITimer{
    private _current:number=0;

    constructor(private _tick:number){

    }

    SetElapsed():void{
        this._current = this._tick-1;
    }

    SetTicks(tick: number): void {
        if(tick <= 1){
            throw 'has to be higher than 1'
        }

        this._tick = tick;
    }    
    
    private Next(): void {
        this._current = (this._current+1) % this._tick;
    }

    IsElapsed(): boolean {
        this.Next();
        return this._current == 0;
    }


}