import { lazyInject } from '../../inversify.config';
import { IAppService } from '../../Services/App/IAppService';
import { IUpdateService } from '../../Services/Update/IUpdateService';
import { ItemsUpdater } from '../../Core/ItemsUpdater';
import { TYPES } from '../../types';
import { Component, h } from 'preact';

export default class CanvasComponent extends Component<{}, {}> {
	@lazyInject(TYPES.Empty) private _appService: IAppService;
	@lazyInject(TYPES.Empty) private _updateService: IUpdateService;

	private _gameCanvas: HTMLDivElement;
	private _updater: ItemsUpdater;
	private _stop: boolean;

	constructor() {
		super();
		this._stop = true;
	}

	componentDidMount() {
		this._stop = false;
		this._gameCanvas.appendChild(this._appService.Publish());
		this._updater = this._updateService.Publish();
		this.GameLoop();
	}

	componentWillUnmount() {
		this._appService.Collect();
	}

	private GameLoop(): void {
		if (this._stop) {
			return;
		}
		requestAnimationFrame(() => this.GameLoop());
		this._updater.Update();
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
