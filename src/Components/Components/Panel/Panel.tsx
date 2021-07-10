import { h, Component, JSX } from 'preact';
import PageAnalyser from '../PageAnalyser';
import StatBar from '../StatBar';
import Background from '../Background';
import Body from '../../Common/Struct/Body';

export default class Panel extends Component<{ content: JSX.Element; footer: JSX.Element }, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<PageAnalyser>
				<Background>
					<Body
						header={<StatBar />}
						content={
							<span>
								<div class="container-column-center-horizontal">
									<div class="logo-container">
										<div class="fill-logo-back-container">
											<div class="fill-logo-back spin-fade" />
										</div>
										<div class="fill-tank-logo slow-bounce" />
										<div class="fill-logo" />
									</div>
									<div>{this.props.children}</div>
								</div>
								{this.props.content}
							</span>
						}
						footer={this.props.footer}
					/>
				</Background>
			</PageAnalyser>
		);
	}
}
