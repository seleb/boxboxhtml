import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { getSelectedBox, setDragging } from '../../reducers/ui';
import { getBoxById, setOffset } from '../../reducers/box';

import Gizmo from './Gizmo';
import { clamp } from '../../utils';

export class GizmoOffset extends Component {
	onMouseDown = (event) => {
		return this.gizmo.getWrappedInstance().startDragging(event);
	}

	onStopDrag = () => { }

	onStartDrag = () => {
		const {
			offsetLeft = 0,
			offsetRight = 0,
			offsetTop = 0,
			offsetBottom = 0,
		} = this.props;
		this.offsets = {
			offsetLeft,
			offsetRight,
			offsetTop,
			offsetBottom,
		};
	}

	onDrag = ({
		x = 0,
		y = 0,
	}) => {
		const {
			offsetLeft = 0,
			offsetRight = 0,
			offsetTop = 0,
			offsetBottom = 0,
		} = this.offsets;
		const offset = {
			offsetLeft,
			offsetRight,
			offsetTop,
			offsetBottom,
		};
		if (this.props.offsets.includes('top')) {
			offset.offsetTop += y;
		}
		if (this.props.offsets.includes('bottom')) {
			offset.offsetBottom += y;
		}
		if (this.props.offsets.includes('left')) {
			offset.offsetLeft += x;
		}
		if (this.props.offsets.includes('right')) {
			offset.offsetRight += x;
		}

		this.props.setOffset({
			id: this.props.id,
			...offset,
		});
	}

	getMousePos({
		clientX = 0,
		clientY = 0,
		parentX = 0,
		parentY = 0,
	}) {
		return {
			x: clientX - parentX,
			y: clientY - parentY,
		};
	}

	render({
		id = '',
		offsets = [],
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
				<div class={`gizmo-offset ${offsets.join(' ')}`} onMouseDown={this.onMouseDown} />
			</Gizmo>
		);
	}
}

export function mapStateToProps(state) {
	const id = getSelectedBox(state);
	const {
		offsetLeft = 0,
		offsetRight = 0,
		offsetTop = 0,
		offsetBottom = 0,
	} = getBoxById(state, id);
	return {
		id,
		offsetLeft,
		offsetRight,
		offsetTop,
		offsetBottom,
	};
}

const mapDispatchToProps = {
	setOffset,
	setDragging,
};

const GizmoOffsetConnected = connect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true })(GizmoOffset);

export default GizmoOffsetConnected;
