import { h, Component } from 'preact';
import { route } from 'preact-router';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';

export default class PopupComponent extends Component<any, any> {
	private _isFirstRender = true;

	constructor() {
		super();
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle-menu menu-container fit-content">
				<div class="title-popup-container">
					<div class="fill-defeat" />
				</div>
				<div class="container-center">
					<div class="container-center-horizontal">
						<BlackButtonComponent
							icon={'fas fa-undo-alt'}
							title={'Back'}
							isFirstRender={this._isFirstRender}
							callBack={() => {}}
						/>
						<RedButtonComponent
							icon={'fas fa-sync-alt'}
							title={'Refresh'}
							isFirstRender={this._isFirstRender}
							callBack={() => {}}
						/>
					</div>
				</div>
			</div>
		);
	}
}
