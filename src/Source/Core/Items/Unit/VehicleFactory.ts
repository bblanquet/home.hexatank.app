import {Vehicle} from './Vehicle'; 
import {Tank} from './Tank';
import { Truck } from './Truck';
import { isNullOrUndefined } from 'util';
import { Ceil } from '../../Ceils/Ceil';
import { Headquarter } from '../../Ceils/Field/Headquarter';

export abstract class VehicleFactory{
    public static GetTank(
        ceil:Ceil, hq:Headquarter)
        :Vehicle
        { 
  
        if(isNullOrUndefined(ceil)){
            throw "not implemented object";
        }

        var tank = new Tank(hq);
        tank.SetPosition(ceil);
        return tank;
    }

    public static GetTruck(
        ceil:Ceil, hq:Headquarter)
        :Vehicle
        {
        var tank = new Truck(hq);
        tank.SetPosition(ceil);
        return tank;
    }
}