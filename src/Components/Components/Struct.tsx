import { h, Component, JSX } from 'preact';
import PageAnalyser from './PageAnalyser';
import Background from './Background';

export default class Struct extends Component<{ header: JSX.Element; content: JSX.Element; footer: JSX.Element }, any> {
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
								<div class="scrollable">{this.props.content}</div>
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
