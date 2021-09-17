import { Hook } from '../Framework/Hook';
import { PopupState } from '../Model/PopupState';
import { StateUpdater } from 'preact/hooks';
import { route } from 'preact-router';
import { StatsKind } from '../../Utils/Stats/StatsKind';

export class MockupPopHook extends Hook<PopupState> {
	constructor(d: [PopupState, StateUpdater<PopupState>]) {
		super(d[0], d[1]);
	}

	public UpdateState(kind: StatsKind): void {
		if (this.State.Canvas) {
			const curves = this.State.Curves.Get(StatsKind[kind]);
			if (curves) {
				this.Update((e) => {
					e.Kind = kind;
					e.Canvas = this.State.Chart.GetCanvas(StatsKind[kind], curves);
				});
			}
		}
	}

	public HasRetry(): boolean {
		return true;
	}

	public Retry(): void {}

	public Quit(): void {
		route('{{sub_path}}Home', true);
	}

	public Unmount(): void {}
}
