import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { getDragging, setDragging } from '../../reducers/ui';

import './Gizmo.css';

export class Gizmo extends Component {
	componentDidUpdate({
		dragging: oldDragging = false,
	}) {
		const {
			dragging: newDragging = false,
		} = this.props;
		if (oldDragging !== newDragging && newDragging) {
			this.startDragging(newDragging);
		}
	}
	onMouseUp = event => {
		event.preventDefault();
		event.stopPropagation();
		// stop dragging
		this.props.setDragging();
		document.removeEventListener('mouseup', this.onMouseUp);
		document.removeEventListener('mousemove', this.onMouseMove);
		return false;
	}
	onMouseMove = event => {
		event.preventDefault();
		event.stopPropagation();
		const {
			dragging = false,
		} = this.props;
		const { x = 0, y = 0 } = this.getMousePos(event);
		const deltaX = dragging !== 'y' ? x - this.x : 0;
		this.x = x;
		const deltaY = dragging !== 'x' ? y - this.y : 0;
		this.y = y;
		this.props.onDrag({
			deltaX,
			deltaY,
		});
		return false;
	}

	getMousePos(event) {
		const {
			clientX = 0,
			clientY = 0,
		} = event;
		return {
			x: (clientX - this.parentX) / this.parentWidth,
			y: (clientY - this.parentY) / this.parentHeight,
		};
	}

	startDragging(dir) {
		// get parent dimensions for calculating new anchor positions
		const parent = this.gizmo.parentElement.parentElement.parentElement.parentElement.parentElement; // :/
		const { left = 0, right = 0, top = 0, bottom = 0 } = parent.getBoundingClientRect();
		this.parentX = left;
		this.parentY = right;
		this.parentWidth = right - left;
		this.parentHeight = bottom - top;
		// get current mouse position as starting point to calc deltas
		const { x = 0, y = 0 } = this.getMousePos(event);
		this.x = x;
		this.y = y;
		document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('mousemove', this.onMouseMove);
		return false;
	}

	render({
		children = [],
	}) {
		return (
			<div class="gizmo" ref={gizmo => this.gizmo = gizmo}>{children}</div>
		);
	}
}

const mapDispatchToProps = {
	setDragging,
};

export default connect(undefined, mapDispatchToProps)(Gizmo);
