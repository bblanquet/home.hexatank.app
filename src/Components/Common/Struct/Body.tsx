import { h, Component, JSX } from 'preact';
import PageAnalyser from '../../Components/PageAnalyser';
import Background from '../../Components/Background';

export default class Body extends Component<
	{ header: JSX.Element; content: JSX.Element; footer: JSX.Element; noScrollbar?: boolean },
	any
> {
	constructor() {
		super();
	}

	render() {
		return (
			<PageAnalyser>
				<Background>
					<div class="wrapper">
						<div class="header">
							<div class="inner">{this.props.header}</div>
						</div>
						<div class="content">
							<div class="inner">
								<div class="scrollable" style={this.props.noScrollbar ? 'overflow:hidden' : ''}>
									{this.props.content}
								</div>
							</div>
						</div>
						<div class="footer">
							<div class="inner">{this.props.footer}</div>
						</div>
					</div>
				</Background>
			</PageAnalyser>
		);
	}
}
