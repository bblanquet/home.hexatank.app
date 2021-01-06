import 'mocha';
import { expect } from 'chai';
import { HexAxial } from '../src/Core/Utils/Geometry/HexAxial';

describe('HexAxial', () => {
	it('it should get all neighbours range 1', () => {
		var coordinate = new HexAxial(4, 4);
		var neighbours = coordinate.GetNeighbours();
		expect(neighbours.length).to.equal(6);
		expect(neighbours[0]).to.contains(new HexAxial(3, 5));
		expect(neighbours[1]).to.contains(new HexAxial(3, 4));
		expect(neighbours[2]).to.contains(new HexAxial(4, 5));
		expect(neighbours[3]).to.contains(new HexAxial(4, 3));
		expect(neighbours[4]).to.contains(new HexAxial(5, 4));
		expect(neighbours[5]).to.contains(new HexAxial(5, 3));
	});

	it('it should get all neighbours range 2', () => {
		const center = new HexAxial(0, 0);
		const cells = center.GetNeighbours(2);
		expect(cells.filter((s) => s.ToCube().Abs() === 2).length).to.equal(6);
		expect(cells.filter((s) => s.ToCube().Abs() === 4).length).to.equal(12);
		expect(cells.length).to.equal(18);
	});

	it('it should get all neighbours range 3', () => {
		const center = new HexAxial(0, 0);
		const cells = center.GetNeighbours(3);
		expect(cells.filter((s) => s.ToCube().Abs() === 2).length).to.equal(6);
		expect(cells.filter((s) => s.ToCube().Abs() === 4).length).to.equal(12);
		expect(cells.filter((s) => s.ToCube().Abs() === 6).length).to.equal(18);
		expect(cells.length).to.equal(36);
	});

	it('it should get one neighbour', () => {
		var coordinate = new HexAxial(4, 4);
		var neighbours = coordinate.GetNeighbour(4);
		expect(neighbours).to.contains(new HexAxial(3, 4));
	});
});
