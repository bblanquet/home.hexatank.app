import { Component, h } from 'preact';
import { ItemsUpdater } from '../../Core/ItemsUpdater';

export default class CanvasComponent extends Component<{ App: PIXI.Application; Updater: ItemsUpdater }, {}> {
	private _gameCanvas: HTMLDivElement;
	private _stop: boolean;

	constructor() {
		super();
		this._stop = true;
	}

	componentDidMount() {
		this._stop = false;
		this._gameCanvas.appendChild(this.props.App.view);
		this.GameLoop();
	}

	private GameLoop(): void {
		if (this._stop) {
			return;
		}
		requestAnimationFrame(() => this.GameLoop());
		this.props.Updater.Update();
	}

	componentDidUpdate() {}

	render() {
		return (
			<div
				ref={(dom) => {
					this._gameCanvas = dom;
				}}
			/>
		);
	}
}
