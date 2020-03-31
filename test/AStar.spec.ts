import 'mocha';
import { expect } from 'chai';
import { AStarNode } from '../src/Core/Ia/AStarNode';
import { SpecHexagonalMapBuilder } from '../src/Core/Setup/Builder/SpecHexagonalMapBuilder';
import { TestHelper } from '../src/Core/Framework/TestHelper';
import { HexAxial } from '../src/Core/Utils/Geometry/HexAxial';
import { CellProperties } from '../src/Core/Items/Cell/CellProperties';

describe('Astar', () => {
	before(() => {
		TestHelper.Init();
		var playgroundMaker = new SpecHexagonalMapBuilder();
		playgroundMaker.Build(6).forEach((cell) => {
			TestHelper.CellContainer.Add(cell);
		});
	});
	it('Get Distance from 44 to 45', () => {
		var startcell = TestHelper.CellContainer.Get(new HexAxial(4, 4));
		var goalcell = TestHelper.CellContainer.Get(new HexAxial(4, 5));
		var starNode = new AStarNode<CellProperties>(startcell);
		var goalNode = new AStarNode<CellProperties>(goalcell);
		var distance = starNode.GetEstimatedCost(goalNode);
		expect(Math.round(startcell.BoundingBox.Height)).to.equals(Math.round(distance));
	});
	it('Get Distance from 52 to 43', () => {
		var startcell = TestHelper.CellContainer.Get(new HexAxial(5, 2));
		var goalcell = TestHelper.CellContainer.Get(new HexAxial(4, 3));
		var starNode = new AStarNode<CellProperties>(startcell);
		var goalNode = new AStarNode<CellProperties>(goalcell);
		var distance = starNode.GetEstimatedCost(goalNode);
		expect(Math.round(startcell.BoundingBox.Width)).to.equals(Math.round(distance));
	});
	it('Get Distance from 41 to 31', () => {
		var startcell = TestHelper.CellContainer.Get(new HexAxial(4, 1));
		var goalcell = TestHelper.CellContainer.Get(new HexAxial(3, 1));
		var starNode = new AStarNode<CellProperties>(startcell);
		var goalNode = new AStarNode<CellProperties>(goalcell);
		var distance = starNode.GetEstimatedCost(goalNode);
		expect(Math.round(startcell.BoundingBox.Height)).to.equals(Math.round(distance));
	});
	it('Get Distance from 44 to 44', () => {
		var startcell = TestHelper.CellContainer.Get(new HexAxial(4, 4));
		var goalcell = TestHelper.CellContainer.Get(new HexAxial(4, 4));
		var starNode = new AStarNode<CellProperties>(startcell);
		var goalNode = new AStarNode<CellProperties>(goalcell);
		var distance = starNode.GetEstimatedCost(goalNode);
		expect(0).to.equals(distance);
	});
	it
		.skip('Find path 44 to 44', () => {
			var startcell = TestHelper.CellContainer.Get(new HexAxial(4, 4));
			var goalcell = TestHelper.CellContainer.Get(new HexAxial(4, 4));
			var result = TestHelper.Engine.GetPath(startcell, goalcell);
			expect(0).to.equals(result.length);
		})
		.timeout(500);
	it
		.skip('Find path 44 to 54', () => {
			var startcell = TestHelper.CellContainer.Get(new HexAxial(4, 4));
			var goalcell = TestHelper.CellContainer.Get(new HexAxial(5, 4));
			var result = TestHelper.Engine.GetPath(startcell, goalcell);
			expect(1).to.equals(result.length);
		})
		.timeout(500);
	it
		.skip('Find path 44 to 64', () => {
			var startcell = TestHelper.CellContainer.Get(new HexAxial(4, 4));
			var goalcell = TestHelper.CellContainer.Get(new HexAxial(6, 4));
			var result = TestHelper.Engine.GetPath(startcell, goalcell);
			expect(2).to.equals(result.length);
		})
		.timeout(500);
	it('Find path 33 to 67', () => {
		var startcell = TestHelper.CellContainer.Get(new HexAxial(3, 3));
		var goalcell = TestHelper.CellContainer.Get(new HexAxial(6, 4));
		var c = TestHelper.CellContainer;
		var result = TestHelper.Engine.GetPath(startcell, goalcell);
		expect(4).to.equals(result.length);
	}).timeout(500);
});
