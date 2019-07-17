import 'mocha';
import { expect } from 'chai';
import {HexAxial} from '../Utils/Coordinates/HexAxial';
import {AStarNode} from '../Ia/AStarNode';
import {TestHelper} from '../Utils/TestHelper';
import { SpecHexagonalMapBuilder } from '../Builder/SpecHexagonalMapBuilder';
import { CeilProperties } from '../Ceils/CeilProperties'; 

describe('Astar',()=>{

    before(()=>{
        TestHelper.Init();
        var playgroundMaker = new SpecHexagonalMapBuilder();
        playgroundMaker.Build(4).forEach(ceil=>
        {
            TestHelper.CeilsContainer.Add(ceil);
        });
    });

    it('Get Distance from 44 to 45',()=>{
        var startCeil = TestHelper.CeilsContainer.Get(new HexAxial(4,4));
        var goalCeil = TestHelper.CeilsContainer.Get(new HexAxial(4,5));

        var starNode = new AStarNode<CeilProperties>(startCeil);
        var goalNode = new AStarNode<CeilProperties>(goalCeil);
        var distance = starNode.GetEstimatedCost(goalNode);
        expect(Math.round(startCeil.BoundingBox.Height)).to.equals(Math.round(distance));
    });

    it('Get Distance from 52 to 43',()=>{
        var startCeil = TestHelper.CeilsContainer.Get(new HexAxial(5,2));
        var goalCeil = TestHelper.CeilsContainer.Get(new HexAxial(4,3));

        var starNode = new AStarNode<CeilProperties>(startCeil);
        var goalNode = new AStarNode<CeilProperties>(goalCeil);
        var distance = starNode.GetEstimatedCost(goalNode);
        expect(Math.round(startCeil.BoundingBox.Height)).to.equals(Math.round(distance));
    });

    it('Get Distance from 41 to 31',()=>{
        var startCeil = TestHelper.CeilsContainer.Get(new HexAxial(4,1));
        var goalCeil = TestHelper.CeilsContainer.Get(new HexAxial(3,1));

        var starNode = new AStarNode<CeilProperties>(startCeil);
        var goalNode = new AStarNode<CeilProperties>(goalCeil);
        var distance = starNode.GetEstimatedCost(goalNode);
        expect(Math.round(startCeil.BoundingBox.Height)).to.equals(Math.round(distance));
    });

    it('Get Distance from 44 to 44',()=>{
        var startCeil = TestHelper.CeilsContainer.Get(new HexAxial(4,4));
        var goalCeil = TestHelper.CeilsContainer.Get(new HexAxial(4,4));

        var starNode = new AStarNode<CeilProperties>(startCeil);
        var goalNode = new AStarNode<CeilProperties>(goalCeil);
        var distance = starNode.GetEstimatedCost(goalNode);
        expect(0).to.equals(distance);
    });

    it.skip('Find path 44 to 44',()=>
    {
        var startCeil = TestHelper.CeilsContainer.Get(new HexAxial(4,4));
        var goalCeil = TestHelper.CeilsContainer.Get(new HexAxial(4,4));

        var result = TestHelper.Engine.GetPath(startCeil,goalCeil);

        expect(0).to.equals(result.length);
    }
    ).timeout(500);


    it.skip('Find path 44 to 54',()=>
    {
        var startCeil = TestHelper.CeilsContainer.Get(new HexAxial(4,4));
        var goalCeil = TestHelper.CeilsContainer.Get(new HexAxial(5,4));

        var result = TestHelper.Engine.GetPath(startCeil,goalCeil);

        expect(1).to.equals(result.length);
    }
    ).timeout(500);


    it.skip('Find path 44 to 64',()=>
    {
        var startCeil = TestHelper.CeilsContainer.Get(new HexAxial(4,4));
        var goalCeil = TestHelper.CeilsContainer.Get(new HexAxial(6,4));

        var result = TestHelper.Engine.GetPath(startCeil,goalCeil);

        expect(2).to.equals(result.length);
    }
    ).timeout(500);

    it('Find path 33 to 67',()=>
    {
        var startCeil = TestHelper.CeilsContainer.Get(new HexAxial(3,3));
        var goalCeil = TestHelper.CeilsContainer.Get(new HexAxial(6,4));

        var result = TestHelper.Engine.GetPath(startCeil,goalCeil);

        expect(4).to.equals(result.length);
    }
    ).timeout(500);
});