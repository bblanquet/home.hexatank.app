import { Component, h } from 'preact';

export default class AnimatedIcon extends Component<{ values: string[]; frequency: number }, any> {
	private _timer: NodeJS.Timer;
	private _index = 0;
	private _iconDiv: HTMLDivElement;

	componentDidMount() {
		this._timer = setInterval(() => this.Animation(), this.props.frequency);
	}

	private Animation(): void {
		clearInterval(this._timer);
		if (this._iconDiv) {
			let current = this._index;
			this._index = (this._index + 1) % this.props.values.length;
			this._iconDiv.classList.remove(this.props.values[current]);
			this._iconDiv.classList.add(this.props.values[this._index]);
		}

		if (this._index === 0) {
			this._timer = setInterval(() => this.Animation(), this.props.frequency);
		} else {
			this._timer = setInterval(() => this.Animation(), this.props.frequency);
		}
	}

	render() {
		return (
			<div
				class={`max-width`}
				ref={(dom) => {
					this._iconDiv = dom;
				}}
			/>
		);
	}
}
