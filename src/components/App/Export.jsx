import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { getStyle } from '../../utils';

import { getBoxById, getChildrenForId } from '../../reducers/box';

export class Export extends Component {
	constructor(props) {
		super(props);
		this.state = {
			download: '',
		};
	}

	componentDidUpdate(prev) {
		if (prev !== this.props) {
			this.setState({
				download: '',
			});
		}
	}

	onClick = () => {
		const state = this.props;
		const getHtml = (id, depth = 0) => {
			const box = getBoxById(state, id);
			const { style } = getStyle(box);
			const space = new Array(depth).fill(0).map(() => '\t').join('');
			return `${space}<div class="${box.name}" style="position: absolute; top: ${style.top}; bottom: ${style.bottom}; left: ${style.left}; right: ${style.right};">
${getChildrenForId(state, id).map(child => getHtml(child, depth + 1)).join('\n') || `<!-- ${box.name} content -->`}
${space}</div>`;
		};
		this.setState({
			download: `data:text/html;base64,${btoa(`
<html>
<head>
<!-- debug style for previewing layout -->
<style>
html, body {
	margin: 0;
	padding: 0;
	overflow: hidden;
}
div {
	background: rgba(0,0,0,0.1);
	border: solid 1px rgba(0,0,0,0.1);
}
</style>
</head>
<body>
<!-- layout -->
${getHtml('root')}
</body>
</html>`)}`
		});
	}

	render({ }, {
		download = '',
	}) {
		return (
			<div class="export">
				<button onClick={this.onClick}>export</button>
				{download && <a download="boxboxhtml-export.html" href={download} title="boxboxhtml-export.html">Download</a>}
			</div>
		);
	}
}

export function mapStateToProps(state) {
	return {
		...state,
	};
}

const ExportConnected = connect(mapStateToProps)(Export);

export default ExportConnected;
