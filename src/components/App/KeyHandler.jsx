import { h, Component } from 'preact';

import { connect } from 'preact-redux';
import { getSelectedBox, getGridAnchor, getGridOffset, setGridAnchor, setGridOffset, selectBox } from '../../reducers/ui';
import { getBoxById, getChildrenForId, setOffset, setAnchor, deleteBox } from '../../reducers/box';

export class KeyHandler extends Component {
	componentDidMount() {
		document.addEventListener('keydown', this.onKeyDown);
	}
	componentWillUnmount() {
		document.addEventListener('keydown', this.onKeyDown);
	}

	onKeyDown = (event) => {
		if (!this.props.selected) {
			return;
		}
		if (event.key === 'Backspace' || event.key === 'Delete') {
			this.props.deleteBox(this.props.selected);
			this.props.selectBox();
		}
	}

	render() {
		return null;
	}
}

export function mapStateToProps(state) {
	const id = getSelectedBox(state);
	return {
		selected: id,
		gridAnchor: getGridAnchor(state),
		gridOffset: getGridOffset(state),
	};
}

const mapDispatchToProps = {
	deleteBox,
	selectBox,
	setOffset,
	setAnchor,
	setGridAnchor,
	setGridOffset,
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyHandler);
