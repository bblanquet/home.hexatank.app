import { Dictionary } from './../src/Utils/Collections/Dictionary';
import { GameSettings } from './../src/Core/Framework/GameSettings';
import { CircleMapBuilder } from './../src/Core/Framework/Builder/CircleMapBuilder';
import { AStarEngine } from './../src/Core/Ia/AStarEngine';
import 'mocha';
import { expect } from 'chai';
import { HexAxial } from '../src/Utils/Geometry/HexAxial';

describe('Astar', () => {
	var cells = new Dictionary<HexAxial>();

	before(() => {
		GameSettings.MapSize = 6;
		var playgroundMaker = new CircleMapBuilder();
		playgroundMaker.GetAllCoos(10).forEach((coo) => {
			cells.Add(coo.ToString(), coo);
		});
	});
	it('Find path 44 to 44', () => {
		var startcell = cells.Get(new HexAxial(4, 4).ToString());
		var goalcell = cells.Get(new HexAxial(4, 4).ToString());
		var result = new AStarEngine<HexAxial>((e) => true, (e) => 1).GetPath(startcell, goalcell);
		expect(0).to.equals(result.length);
	});
	it('Find path 44 to 54', () => {
		var startcell = cells.Get(new HexAxial(4, 4).ToString());
		var goalcell = cells.Get(new HexAxial(5, 4).ToString());
		var result = new AStarEngine<HexAxial>((e) => true, (e) => 1).GetPath(startcell, goalcell);
		expect(1).to.equals(result.length);
	}).timeout(500);
	it('Find path 44 to 64', () => {
		var startcell = cells.Get(new HexAxial(4, 4).ToString());
		var goalcell = cells.Get(new HexAxial(6, 4).ToString());
		var result = new AStarEngine<HexAxial>((e) => true, (e) => 1).GetPath(startcell, goalcell);
		expect(2).to.equals(result.length);
	}).timeout(500);
});
