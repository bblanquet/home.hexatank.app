import { h, Component, JSX } from 'preact';
import Switch from '../Struct/Switch';

export default class Grid extends Component<{ left: JSX.Element; right: JSX.Element; isFitContent?: boolean }, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<Switch
				isLeft={this.props.isFitContent}
				left={
					<div class="container-center-horizontal">
						<div class="custom-grid-layout-4" style="width:fit-content;">
							<div class="custom-grid-layout-3">
								<table
									class="table table-striped table-borderless custom-table"
									style="width:fit-content;"
								>
									{this.props.left}
									{this.props.right}
								</table>
							</div>
						</div>
					</div>
				}
				right={
					<div class="container-center-horizontal">
						<div class="custom-grid-layout-4">
							<div class="custom-grid-layout-3">
								<table class="table table-striped table-borderless custom-table ">
									{this.props.left}
									{this.props.right}
								</table>
							</div>
						</div>
					</div>
				}
			/>
		);
	}
}
