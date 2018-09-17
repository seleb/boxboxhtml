import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { getSelectedBox, getDragging, setDragging } from '../../reducers/ui';
import { getBoxById, setAnchor } from '../../reducers/box';

import Gizmo from './Gizmo';
import { clamp } from '../../utils';

export class GizmoAnchor extends Component {
	onMouseDown = (event) => {
		return this.gizmo.getWrappedInstance().startDragging(event);
	}

	onStopDrag = () => { }

	onStartDrag = () => {
		const {
			anchorLeft = 0,
			anchorRight = 0,
			anchorTop = 0,
			anchorBottom = 0,
		} = this.props;
		this.anchors = {
			anchorLeft: clamp(0, anchorLeft, 1),
			anchorRight: clamp(0, anchorRight, 1),
			anchorTop: clamp(0, anchorTop, 1),
			anchorBottom: clamp(0, anchorBottom, 1),
		};
	}

	onDrag = ({
		x = 0,
		y = 0,
	}) => {
		const {
			anchorLeft = 0,
			anchorRight = 0,
			anchorTop = 0,
			anchorBottom = 0,
		} = this.anchors;
		const anchor = {
			anchorLeft,
			anchorRight,
			anchorTop,
			anchorBottom,
		};
		if (this.props.anchors.includes('top')) {
			anchor.anchorTop += y;
		}
		if (this.props.anchors.includes('bottom')) {
			anchor.anchorBottom += y;
		}
		if (this.props.anchors.includes('left')) {
			anchor.anchorLeft += x;
		}
		if (this.props.anchors.includes('right')) {
			anchor.anchorRight += x;
		}

		if (this.props.anchors.includes('left') && anchor.anchorLeft > anchor.anchorRight) {
			anchor.anchorLeft = anchor.anchorRight;
		}
		if (this.props.anchors.includes('top') && anchor.anchorTop > anchor.anchorBottom) {
			anchor.anchorTop = anchor.anchorBottom;
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
			<Gizmo
				onDrag={this.onDrag}
				onStartDrag={this.onStartDrag}
				onStopDrag={this.onStopDrag}
				getMousePos={this.getMousePos}
				boxId={id}
				ref={gizmo => this.gizmo = gizmo}
			>
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
