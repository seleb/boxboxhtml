import { h, Component, Fragment } from 'preact';

import './Box.css';
import { connect } from 'preact-redux';
import { getSelectedBox, selectBox } from '../../reducers/ui';
import { getBoxById, getChildrenForId, createBox, setAnchor } from '../../reducers/box';
import Gizmo from './Gizmo';
import { clamp } from '../../utils';
let num = 10;
const colourCycle = [
	[89, 208, 241],
	[239, 134, 149],
	[239, 237, 116],
	[69, 221, 165],
	[165, 157, 195]
];

export class Box extends Component {
	componentDidMount() {
		if (num > 0) {
			const n = Math.floor(Math.random() * 2) + 1;
			num -= n;
			for (let i = 0; i < n; ++i) {
				this.props.createBox(this.props.id);
			}
		}
		if (this.props.id !== 'root') {
			this.props.setAnchor({
				id: this.props.id,
				anchorLeft: Math.random() * 0.5,
				anchorRight: Math.random() * 0.5 + 0.5,
				anchorTop: Math.random() * 0.5,
				anchorBottom: Math.random() * 0.5 + 0.5,
			});
		}
	}

	onClick = (event) => {
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
		}
	}

	render({
		id = '',
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
		colour = [0, 0, 0],
	}) {
		const anchorStyle = {
			top: `${anchorTop * 100}%`,
			bottom: `${(1 - anchorBottom) * 100}%`,
			left: `${anchorLeft * 100}%`,
			right: `${(1 - anchorRight) * 100}%`,
		};
		const offsetStyle = {
			top: `${offsetTop}px`,
			bottom: `${offsetBottom}px`,
			left: `${offsetLeft}px`,
			right: `${offsetRight}px`,
		};
		const style = {
			top: `calc(${anchorStyle.top} + ${offsetStyle.top})`,
			bottom: `calc(${anchorStyle.bottom} + ${offsetStyle.bottom})`,
			left: `calc(${anchorStyle.left} + ${offsetStyle.left})`,
			right: `calc(${anchorStyle.right} + ${offsetStyle.right})`,
			background: `rgba(${colour.join(', ')}, ${selected ? 1 : 0.75})`,
		};
		const colourOffset = colourCycle.findIndex(c => c === colour);
		return (
			<Fragment>
				<div class={`box ${selected ? 'selected' : ''}`} onClick={this.onClick} style={style}>
					{id}
					<ol class="children">
						{children.map((child, idx) => {
							const colour = colourCycle[(idx + colourOffset + 1) % colourCycle.length];
							return <li key={child}><BoxConnected id={child} colour={colour} /></li>;
						})}
					</ol>
				</div>
				<div class="box-anchor" style={anchorStyle}>
					{selected && <Gizmo />}
					<div class="box-offset" style={offsetStyle} />
				</div>
			</Fragment>
		);
	}
}

export function mapStateToProps(state, { id = '' }) {
	let {
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
	return {
		selected: getSelectedBox(state) === id,
		offsetLeft,
		offsetRight,
		offsetTop,
		offsetBottom,
		anchorLeft,
		anchorRight,
		anchorTop,
		anchorBottom,
		children: getChildrenForId(state, id),
	};
}

const mapDispatchToProps = {
	selectBox,
	createBox,
	setAnchor,
};

const BoxConnected = connect(mapStateToProps, mapDispatchToProps)(Box);

export default BoxConnected;
