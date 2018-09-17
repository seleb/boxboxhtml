import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { getSelectedBox, getDragging, setDragging } from '../../reducers/ui';
import { getBoxById, setAnchor } from '../../reducers/box';

import Gizmo from './Gizmo';

export class GizmoAnchor extends Component {
	onMouseDown = (event) => {
		return this.gizmo.getWrappedInstance().startDragging(event);
	}

	onDrag = ({
		deltaX = 0,
		deltaY = 0,
	}) => {
		const {
			anchorLeft = 0,
			anchorRight = 0,
			anchorTop = 0,
			anchorBottom = 0,
		} = this.props;
		const anchor = {
			anchorLeft,
			anchorRight,
			anchorTop,
			anchorBottom,
		};
		if (this.props.anchors.includes('top')) {
			anchor.anchorTop += deltaY;
		}
		if (this.props.anchors.includes('bottom')) {
			anchor.anchorBottom += deltaY;
		}
		if (this.props.anchors.includes('left')) {
			anchor.anchorLeft += deltaX;
		}
		if (this.props.anchors.includes('right')) {
			anchor.anchorRight += deltaX;
		}
		this.props.setAnchor({
			id: this.props.id,
			...anchor,
		});
	}

	getMousePos({
		clientX = 0,
		clientY = 0,
		parentX = 0,
		parentY = 0,
		parentWidth = 0,
		parentHeight = 0,
	}) {
		return {
			x: (clientX - parentX) / parentWidth,
			y: (clientY - parentY) / parentHeight,
		};
	}

	render({
		id = '',
		anchors = [],
	}) {
		return (
			<Gizmo onDrag={this.onDrag} getMousePos={this.getMousePos} boxId={id} ref={gizmo => this.gizmo = gizmo}>
				<div class={`gizmo-anchor ${anchors.join(' ')}`} onMouseDown={this.onMouseDown} />
			</Gizmo>
		);
	}
}

export function mapStateToProps(state) {
	const id = getSelectedBox(state);
	const {
		anchorLeft = 0,
		anchorRight = 0,
		anchorTop = 0,
		anchorBottom = 0,
	} = getBoxById(state, id);
	return {
		id,
		anchorLeft,
		anchorRight,
		anchorTop,
		anchorBottom,
	};
}

const mapDispatchToProps = {
	setAnchor,
	setDragging,
};

const GizmoAnchorConnected = connect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true })(GizmoAnchor);

export default GizmoAnchorConnected;
