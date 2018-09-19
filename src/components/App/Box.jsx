import { h, Component, Fragment } from 'preact';
import { connect } from 'preact-redux';
import { clamp, getStyle } from '../../utils';

import { getSelectedBox, getGridAnchor, getGridOffset, selectBox } from '../../reducers/ui';
import { getBoxById, getChildrenForId, createBox, setAnchor } from '../../reducers/box';

import GizmoTranslate from './GizmoTranslate';
import GizmoScale from './GizmoScale';
import GizmoTranslateOffset from './GizmoTranslateOffset';
import GizmoScaleOffset from './GizmoScaleOffset';

import './Box.css';

export function AnchorGrid({
	colour = 'black',
	units = 0,
}) {
	const p = 1 / units * 100;
	let g = `repeating-linear-gradient(0deg, ${colour}, transparent 1px, transparent calc(${p}% - 1px), ${colour} ${p}%)`;
	g = g + ',' + g.replace('0deg', '-90deg');
	return <div class="box-grid" style={{ backgroundImage: g }} />;
}

const colourCycle = [
	[0, 0, 0],
	[150, 150, 150],
	[100, 100, 100],
	[50, 50, 50],
	[200, 200, 200]
];

export class Box extends Component {
	onMouseDown = (event) => {
		const {
			target,
			currentTarget,
		} = event;
		if (target !== currentTarget) {
			return;
		}
		if (!this.props.selected) {
			this.props.selectBox(this.props.id);
			event.preventDefault();
			event.stopPropagation();
			return false;
		}
	}

	render({
		name = '',
		selected = false,
		offsetLeft = 0,
		offsetRight = 0,
		offsetTop = 0,
		offsetBottom = 0,
		anchorLeft = 0,
		anchorRight = 1,
		anchorTop = 0,
		anchorBottom = 1,
		children = [],
		childSelected = false,
		colour = [255, 255, 255],
		gridAnchor = 0,
	}) {
		const {
			anchorStyle,
			offsetStyle,
			style,
		} = getStyle({
			offsetLeft,
			offsetRight,
			offsetTop,
			offsetBottom,
			anchorLeft,
			anchorRight,
			anchorTop,
			anchorBottom,
		})
		style.backgroundColor = `rgba(${colour.join(', ')}, ${selected ? 1 : 0.75})`;
		const colourOffset = colourCycle.findIndex(c => c === colour);

		return (
			<Fragment>
				<div class={`box ${selected ? 'selected' : ''}`} onMouseDown={this.onMouseDown} style={style}>
					{childSelected && <AnchorGrid colour={'rgba(0,0,0,0.25)'} units={gridAnchor} />}
					{name}
					<ol class="children">
						{children.map((child, idx) => {
							const colour = colourCycle[(idx + colourOffset + 1) % colourCycle.length];
							return <li key={child}><BoxConnected id={child} colour={colour} /></li>;
						})}
					</ol>
				</div>
				{selected && <div class="box-anchor" style={anchorStyle}>
					<div class="box-offset" style={offsetStyle}>
						<GizmoTranslateOffset />
						<GizmoScaleOffset />
					</div>
					<GizmoTranslate />
					<GizmoScale />
				</div>}
			</Fragment>
		);
	}
}

export function mapStateToProps(state, { id = '' }) {
	let {
		name = '',
		offsetLeft = 0,
		offsetRight = 0,
		offsetTop = 0,
		offsetBottom = 0,
		anchorLeft = 0,
		anchorRight = 0,
		anchorTop = 0,
		anchorBottom = 0,
	} = getBoxById(state, id);
	anchorRight = clamp(Math.max(0, anchorLeft), anchorRight, 1);
	anchorLeft = clamp(0, anchorLeft, anchorRight);
	anchorBottom = clamp(Math.max(0, anchorTop), anchorBottom, 1);
	anchorTop = clamp(0, anchorTop, anchorBottom);
	const gridAnchor = getGridAnchor(state);
	const selected = getSelectedBox(state);
	const children = getChildrenForId(state, id);
	return {
		selected: selected === id && id !== 'root',
		name,
		offsetLeft,
		offsetRight,
		offsetTop,
		offsetBottom,
		anchorLeft,
		anchorRight,
		anchorTop,
		anchorBottom,
		children,
		childSelected: children.includes(selected),
		gridAnchor,
	};
}

const mapDispatchToProps = {
	selectBox,
	createBox,
	setAnchor,
};

const BoxConnected = connect(mapStateToProps, mapDispatchToProps)(Box);

export default BoxConnected;
