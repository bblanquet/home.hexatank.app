import { Hook } from './Hook';
import { Component, JSX } from 'preact';

export abstract class HookedComponent<T1, T2 extends Hook<T3>, T3> extends Component<T1> {
	private _render: () => JSX.Element = this.Init.bind(this);
	protected Hook: T2;

	public abstract Rendering(): JSX.Element;
	public abstract GetDefaultHook(): T2;

	private Init(): JSX.Element {
		this.Hook = this.GetDefaultHook();
		this._render = this.Rendering.bind(this);
		return this.Rendering();
	}

	render() {
		return this._render();
	}

	componentWillUnmount() {
		this.Hook.Unmount();
	}
}
