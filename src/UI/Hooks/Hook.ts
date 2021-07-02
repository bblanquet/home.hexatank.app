import { StateUpdater } from 'preact/hooks';

export abstract class Hook<T> {
	public constructor(public State: T, protected SetState: StateUpdater<T>) {}
	private StateChanged(): void {
		this.SetState({ ...this.State });
	}

	protected SetProp(setter: (state: T) => void): void {
		setter(this.State);
		this.StateChanged();
	}

	public abstract Unmount(): void;
}
