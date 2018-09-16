import { h, Component } from 'preact';

import './Editor.css';
import { connect } from 'preact-redux';
import { getSelectedBox } from '../../reducers/ui';
import { getBoxById, getChildrenForId, setOffset, setAnchor } from '../../reducers/box';

export class Editor extends Component {
	onInputOffset = ({
		currentTarget: {
			name = '',
			value = 0,
		},
	}) => {
		const {
			offsetLeft = 0,
			offsetRight = 0,
			offsetTop = 0,
			offsetBottom = 0,
		} = this.props;
		this.props.setOffset({
			id: this.props.id,
			...{ offsetLeft, offsetRight, offsetTop, offsetBottom },
			[name]: value,
		});
	}

	onInputAnchor = ({
		currentTarget: {
			name = '',
			value = 0,
		},
	}) => {
		const {
			anchorLeft = 0,
			anchorRight = 0,
			anchorTop = 0,
			anchorBottom = 0,
		} = this.props;
		this.props.setAnchor({
			id: this.props.id,
			...{ anchorLeft, anchorRight, anchorTop, anchorBottom },
			[name]: value,
		});
	}

	render({
		id = '',
		offsetLeft = 0,
		offsetRight = 0,
		offsetTop = 0,
		offsetBottom = 0,
		anchorLeft = 0,
		anchorRight = 1,
		anchorTop = 0,
		anchorBottom = 1,
		children = [],
	}) {
		// const style = {
		// 	top: `calc(${anchorTop*100}% + ${offsetTop}px)`,
		// 	bottom: `calc(${(1.0 - anchorBottom)*100}% + ${offsetBottom}px)`,
		// 	left: `calc(${anchorLeft*100}% + ${offsetLeft}px)`,
		// 	right: `calc(${(1.0 - anchorRight)*100}% + ${offsetRight}px)`,
		// };
		return (
			<div class="editor" >
				<h2>Offset</h2>
				<label htmlFor="offsetLeft">Left</label><input name="offsetLeft" type="range" min="-100" max="100" step="any" value={offsetLeft} onInput={this.onInputOffset} />
				<label htmlFor="offsetRight">Right</label><input name="offsetRight" type="range" min="-100" max="100" step="any" value={offsetRight} onInput={this.onInputOffset} />
				<label htmlFor="offsetTop">Top</label><input name="offsetTop" type="range" min="-100" max="100" step="any" value={offsetTop} onInput={this.onInputOffset} />
				<label htmlFor="offsetBottom">Bottom</label><input name="offsetBottom" type="range" min="-100" max="100" step="any" value={offsetBottom} onInput={this.onInputOffset} />
				<h2>Anchor</h2>
				<label htmlFor="anchorLeft">Left</label><input name="anchorLeft" type="range" min="0" max="1" step="any" value={anchorLeft} onInput={this.onInputAnchor} />
				<label htmlFor="anchorRight">Right</label><input name="anchorRight" type="range" min="0" max="1" step="any" value={anchorRight} onInput={this.onInputAnchor} />
				<label htmlFor="anchorTop">Top</label><input name="anchorTop" type="range" min="0" max="1" step="any" value={anchorTop} onInput={this.onInputAnchor} />
				<label htmlFor="anchorBottom">Bottom</label><input name="anchorBottom" type="range" min="0" max="1" step="any" value={anchorBottom} onInput={this.onInputAnchor} />
			</div>
		);
	}
}

export function mapStateToProps(state) {
	const id = getSelectedBox(state);
	return {
		id,
		...getBoxById(state, id),
		children: getChildrenForId(state, id),
	};
}

const mapDispatchToProps = {
	setOffset,
	setAnchor,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
