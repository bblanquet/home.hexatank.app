import { Component, h } from 'preact';
import { route } from 'preact-router';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { Face } from '../Components/Face';
import NavbarComponent from '../Components/NavbarComponent';
import Redirect from '../Components/RedirectComponent';

export default class ErrorScreen extends Component<any, any> {
	private Back() {
		route('{{sub_path}}Home', true);
	}

	render() {
		return (
			<Redirect>
				<NavbarComponent>
					<div class="container-center">
						<Face eyes={[]} mouths={[]} face={'fill-exception'} />
						<div class="text-detail shadowEffect width80percent">
							<h5 class="card-title">OOPS an error occured</h5>
							<div>{GameContext.Error.message}</div>
							<p />
							<div class="sub-text-detail max200Height">{GameContext.Error.stack}</div>
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
