import { StateUpdater } from 'preact/hooks';
import { Hook } from '../Framework/Hook';
import { route } from 'preact-router';
import { SmState } from '../Model/SmState';

export class MockupSmHook extends Hook<SmState> {
	constructor(d: [SmState, StateUpdater<SmState>]) {
		super(d[0], d[1]);
	}

	public Quit(): void {
		route('{{sub_path}}Home', true);
	}

	public HasRetry(): boolean {
		return true;
	}

	public Retry(): void {}

	public Unmount(): void {}
}
