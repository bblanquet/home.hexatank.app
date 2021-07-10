import { isEqual } from 'lodash';
import * as luxon from 'luxon';
import { Component, h } from 'preact';
import { LogKind } from '../../Utils/Logger/LogKind';
import { LogMessage } from '../../Utils/Logger/LogMessage';
import { StaticLogger } from '../../Utils/Logger/StaticLogger';
import Grid from '../Common/Grid/GridComponent';
import CtmIconInput from '../Common/Input/CtmIconInput';

export default class LogComponent extends Component<
	{ Messages: LogMessage[] },
	{ FilteredMsgs: LogMessage[]; Messages: LogMessage[]; Filter: string; Exclude: string; Min: number; Max: number }
> {
	constructor() {
		super();
		this.setState({
			FilteredMsgs: [],
			Messages: [],
			Filter: '',
			Exclude: '',
			Min: 0,
			Max: 0
		});
	}

	public render() {
		return (
			<div>
				<div class="container-center-horizontal">
					<CtmIconInput
						value={this.state.Filter}
						icon={'fas fa-folder-plus'}
						type={'text'}
						isEditable={true}
						onInput={(e: any) => {
							if (e.target.value) {
								this.setState({
									Filter: e.target.value
								});
							} else {
								this.setState({
									Filter: ''
								});
							}
						}}
					/>
					<CtmIconInput
						value={this.state.Exclude}
						icon={'fas fa-folder-minus'}
						type={'text'}
						isEditable={true}
						onInput={(e: any) => {
							if (e.target.value) {
								this.setState({
									Exclude: e.target.value
								});
							} else {
								this.setState({
									Exclude: ''
								});
							}
						}}
					/>
				</div>
				<div class="container-center-horizontal">
					<CtmIconInput
						value={this.state.Min}
						icon={'fas fa-step-forward'}
						type={'number'}
						isEditable={true}
						onInput={(e: any) => {
							if (e.target.value) {
								this.setState({
									Min: e.target.value
								});
							} else {
								this.setState({
									Min: 0
								});
							}
						}}
					/>
					<CtmIconInput
						value={this.state.Max}
						icon={'fas fa-step-backward'}
						type={'number'}
						isEditable={true}
						onInput={(e: any) => {
							if (e.target.value) {
								this.setState({
									Max: e.target.value
								});
							} else {
								this.setState({
									Max: 0
								});
							}
						}}
					/>
				</div>
				<Grid left={this.GetHeader()} right={this.GetContent()} />
			</div>
		);
	}

	componentDidUpdate() {
		let msgs = this.GetFilteredMsg(this.state.Messages);
		msgs = this.GetExcludedMsg(msgs);
		msgs = this.GetRangedMessages(msgs);
		if (!isEqual(this.state.FilteredMsgs, msgs)) {
			this.setState({
				FilteredMsgs: msgs
			});
		}
	}

	private GetRangedMessages(msgs: LogMessage[]): LogMessage[] {
		if (this.state.Min < this.state.Max) {
			return msgs.filter((m) => this.state.Min * 1000 <= m.Date && m.Date <= this.state.Max * 1000);
		} else {
			return msgs;
		}
	}

	private GetFilteredMsg(msgs: LogMessage[]): LogMessage[] {
		if (this.state.Filter && 0 < this.state.Filter.length) {
			return msgs.filter((e) => {
				if (e.Content && e.Content.constructor.name === 'String') {
					return e.Content.toLowerCase().includes(this.state.Filter.toLowerCase());
				}
				return false;
			});
		} else {
			return msgs;
		}
	}

	private GetExcludedMsg(msgs: LogMessage[]): LogMessage[] {
		if (this.state.Exclude && 0 < this.state.Exclude.length) {
			return msgs.filter((e) => {
				if (e.Content && e.Content.constructor.name === 'String') {
					return !e.Content.toLowerCase().includes(this.state.Exclude.toLowerCase());
				}
				return false;
			});
		} else {
			return msgs;
		}
	}

	private GetHeader() {
		return (
			<thead>
				<tr class="d-flex">
					<th scope="col">Logs</th>
				</tr>
			</thead>
		);
	}

	componentDidMount() {
		if (this.props.Messages) {
			this.setState({
				Messages: this.props.Messages
			});
		}
	}

	private GetContent() {
		return (
			<tbody>
				{this.state.FilteredMsgs.map((message: LogMessage) => (
					<tr class="d-flex">
						<td class="align-self-center" style={`color:${StaticLogger.Colors.Get(LogKind[message.Kind])}`}>
							&#11044;
						</td>
						<td class="align-self-center">
							{luxon.DateTime.fromJSDate(new Date(message.Date)).toFormat('mm:ss.S')}
						</td>
						<td class="align-self-center">
							<span class="badge badge-light">{message.Author}</span>
						</td>
						<td class="align-self-center">{message.Content}</td>
					</tr>
				))}
			</tbody>
		);
	}
}
