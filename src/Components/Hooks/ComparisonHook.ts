import { Hook } from './Hook';
import { ComparisonState } from '../Model/ComparisonState';
import { StateUpdater } from 'preact/hooks';
import { ICompareService } from '../../Services/Compare/ICompareService';
import { Singletons, SingletonKey } from '../../Singletons';
import { LogMessage } from '../../Utils/Logger/LogMessage';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { StatusDuration } from '../Common/Chart/Model/StatusDuration';
import { ComparisonKind } from '../Model/ComparisonKind';

export class ComparisonHook extends Hook<ComparisonState> {
	private _compareService: ICompareService;

	constructor(d: [ComparisonState, StateUpdater<ComparisonState>]) {
		super(d[0], d[1]);
		this._compareService = Singletons.Load<ICompareService>(SingletonKey.Compare);
	}
	public static DefaultState(): ComparisonState {
		const v = new ComparisonState();
		v.Kind = ComparisonKind.Vehicle;
		return v;
	}

	public GetLogs(): LogMessage[] {
		return this._compareService.GetLogs();
	}
	public GetCellDelta(): Dictionary<StatusDuration[]> {
		return this._compareService.GetCellDelta();
	}
	public GetVehicleDelta(): Dictionary<StatusDuration[]> {
		return this._compareService.GetVehicleDelta();
	}

	public ChangeState(value: ComparisonKind): void {
		this.Update((e) => (e.Kind = value));
	}

	public Unmount(): void {}
}
