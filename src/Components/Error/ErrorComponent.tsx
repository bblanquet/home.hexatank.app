import { Component, h } from 'preact';
import { route } from 'preact-router';
import { GameContext } from '../../Core/Framework/GameContext';
import { FaceComponent } from '../Campaign/FaceComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import NavbarComponent from '../Common/Navbar/NavbarComponent';
import Redirect from '../Redirect/RedirectComponent';

export default class ErrorComponent extends Component<any, any> {
	private Back() {
		route('/Home', true);
	}

	render() {
		return (
			<Redirect>
				<NavbarComponent>
					<div class="container-center">
						<FaceComponent eyes={[]} mouths={[]} face={'fill-exception'} />
						<div class="text-detail effect7 maxcontainer">
							<h5 class="card-title">OOPS an error occured</h5>
							<div>{GameContext.Error.message}</div>
							<p />
							<div class="sub-text-detail maxHeight">{GameContext.Error.stack}</div>
						</div>
						<p />
						<ButtonComponent
							callBack={() => {
								this.Back();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</ButtonComponent>
					</div>
				</NavbarComponent>
			</Redirect>
		);
	}
}