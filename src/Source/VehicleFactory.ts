import {Ceil} from './Ceil';
import {Vehicle} from './Vehicle';
import {Tank} from './Tank';
import { Truck } from './Truck';
import { isNullOrUndefined } from 'util';

export abstract class VehicleFactory{
    public static GetTank(
        ceil:Ceil)
        :Vehicle
        {

        if(isNullOrUndefined(ceil)){
            throw "not implemented object";
        }

        var tank = new Tank();
        tank.SetPosition(ceil);
        return tank;
    }

    public static GetTruck(
        ceil:Ceil)
        :Vehicle
        {
        var tank = new Truck();
        tank.SetPosition(ceil);
        return tank;
    }
}