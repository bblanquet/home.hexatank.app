import { Cell } from '../../../Items/Cell/Cell';
import { FieldHelper } from '../../FieldTypeHelper';
import { CellType } from './CellType';
import { Coo } from './Coo';

export class CellPrint {
	public Field: string;
	public Id: string;
	public CId: string;

	public Type: CellType;
	public Coo: Coo;

	public static New(q: number, r: number): CellPrint {
		const m = new CellPrint();
		m.Coo = new Coo();
		m.Type = CellType.None;
		m.Coo.R = r;
		m.Coo.Q = q;
		return m;
	}

	public static NewFromCell(cell: Cell): CellPrint {
		const cellPrint = new CellPrint();
		cellPrint.CId = cell.Coo();
		cellPrint.Field = FieldHelper.GetName(cell.GetField());
		cellPrint.Id = cell.GetField().GetIdentity() ? cell.GetField().GetIdentity().Name : '';
		return cellPrint;
	}
}
