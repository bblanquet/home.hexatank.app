import { GameSettings } from './../src/Core/Framework/GameSettings';
import { CircleMapBuilder } from './../src/Core/Setup/Builder/CircleMapBuilder';
import { AStarEngine } from './../src/Core/Ia/AStarEngine';
import { CellContext } from './../src/Core/Items/Cell/CellContext';
import 'mocha';
import { expect } from 'chai';
import { AStarNode } from '../src/Core/Ia/AStarNode';
import { HexAxial } from '../src/Core/Utils/Geometry/HexAxial';
import { SimpleCell } from './SimpleCell';

describe('Astar', () => {
	var cells = new CellContext<SimpleCell>();

	before(() => {
		GameSettings.MapSize = 6;
		var playgroundMaker = new CircleMapBuilder();
		playgroundMaker.Build(6).forEach((coo) => {
			cells.Add(new SimpleCell(coo, cells));
		});
	});
	it('Find path 44 to 44', () => {
		var startcell = cells.Get(new HexAxial(4, 4));
		var goalcell = cells.Get(new HexAxial(4, 4));
		var result = new AStarEngine<SimpleCell>().GetPath(startcell, goalcell);
		expect(0).to.equals(result.length);
	});
	it('Find path 44 to 54', () => {
		var startcell = cells.Get(new HexAxial(4, 4));
		var goalcell = cells.Get(new HexAxial(5, 4));
		var result = new AStarEngine<SimpleCell>().GetPath(startcell, goalcell);
		expect(1).to.equals(result.length);
	}).timeout(500);
	it('Find path 44 to 64', () => {
		var startcell = cells.Get(new HexAxial(4, 4));
		var goalcell = cells.Get(new HexAxial(6, 4));
		var result = new AStarEngine<SimpleCell>().GetPath(startcell, goalcell);
		expect(2).to.equals(result.length);
	}).timeout(500);
	it('Find path 33 to 67', () => {
		var startcell = cells.Get(new HexAxial(3, 3));
		var goalcell = cells.Get(new HexAxial(6, 4));
		var c = cells;
		var result = new AStarEngine<SimpleCell>().GetPath(startcell, goalcell);
		expect(4).to.equals(result.length);
	}).timeout(500);
});
