import 'mocha';
import { expect } from 'chai';
import {HexAxial} from '../Coordinates/HexAxial';

describe('HexAxial',() =>
{
    it('it should get all neighbours',()=>{
        var coordinate = new HexAxial(4,4);
        var neighbours = coordinate.GetNeighbours();
        expect(neighbours.length).to.equal(6);
        expect(neighbours[0]).to.contains(new HexAxial(5,3));
        expect(neighbours[1]).to.contains(new HexAxial(5,4));
        expect(neighbours[2]).to.contains(new HexAxial(4,5));
        expect(neighbours[3]).to.contains(new HexAxial(3,5));
        expect(neighbours[4]).to.contains(new HexAxial(3,4));
        expect(neighbours[5]).to.contains(new HexAxial(4,3));
    });

    it('it should get one neighbour',()=>{
        var coordinate = new HexAxial(4,4);
        var neighbours = coordinate.GetNeighbour(4);
        expect(neighbours).to.contains(new HexAxial(3,4));
    });
});