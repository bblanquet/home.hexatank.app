import axios, { AxiosResponse } from 'axios';
import { StateUpdater, useState } from 'preact/hooks';

export abstract class Hook<T> {
	protected SetState: StateUpdater<{ data: T }>;
	public CallBack() {
		const [ data, setState ] = useState({ data: null });
		this.SetState = setState;
	}
	public abstract GetData(): T;
}
