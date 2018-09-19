import { h, Component } from 'preact';

import './Editor.css';
import { connect } from 'preact-redux';
import { getSelectedBox, getGridAnchor, getGridOffset, setGridAnchor, setGridOffset } from '../../reducers/ui';
import { getBoxById, getChildrenForId, setOffset, setAnchor, setName } from '../../reducers/box';
import Export from './Export';

export function OffsetCtrl({
	name = '',
	value = 0,
	onInput,
	step = 'any',
}) {
	const labelName = `offset${name}`;
	return (
		<div class="ctrl ctrl-offset">
			<label htmlFor={labelName}>{name}</label>
			<input name={labelName} id={labelName} type="number" step={step} value={Number.parseFloat(value).toFixed(2)} onInput={onInput} />
			<label htmlFor={labelName}>px</label>
		</div>
	);
}

export function AnchorCtrl({
	name = '',
	value = 0,
	onInput,
	step = 'any',
	min = 0,
	max = 1,
}) {
	const labelName = `anchor${name}`;
	return (
		<div class="ctrl ctrl-anchor">
			<label htmlFor={labelName}>{name}</label>
			<input name={labelName} id={labelName} type="range" min={min} max={max} step="any" value={value} onInput={onInput} />
			<input name={labelName} type="number" min={min} max={max} step={step} value={Number.parseFloat(value).toFixed(2)} onInput={onInput} />
		</div>
	);
}

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

	onInputGridAnchor = ({
		currentTarget: {
			value = 0,
		},
	}) => {
		this.props.setGridAnchor(value);
	}

	onInputGridOffset = ({
		currentTarget: {
			value = 0,
		},
	}) => {
		this.props.setGridOffset(value);
	}
	
	onInputName = ({
		currentTarget: {
			value = '',
		},
	}) => {
		this.props.setName({ id: this.props.id, name: value });
	}

	render({
		name = '',
		offsetLeft = 0,
		offsetRight = 0,
		offsetTop = 0,
		offsetBottom = 0,
		anchorLeft = 0,
		anchorRight = 1,
		anchorTop = 0,
		anchorBottom = 1,
		gridAnchor = 0,
		gridOffset = 0,
	}) {
		return (
			<div class="editor">
				<section class="section-grid">
					<h2>Grid</h2>
					<div class="ctrl ctrl-grid">
						<label htmlFor="gridOffset">Offset</label>
						<input name="gridOffset" id="gridOffset" type="number" min="0" value={gridOffset} onInput={this.onInputGridOffset} />
						<label htmlFor="gridOffset">px</label>
					</div>
					<div class="ctrl ctrl-grid">
						<label htmlFor="gridAnchor">Anchor</label>
						<input name="gridAnchor" id="gridAnchor" type="number" min="0" max="100" value={gridAnchor} onInput={this.onInputGridAnchor} />
						<label htmlFor="gridAnchor">segments</label>
					</div>
				</section>
				<section class="section-name">
					<h2>Name</h2>
					<div class="ctrl ctrl-name">
						<label htmlFor="boxName">Name</label>
						<input name="boxName" id="boxName" type="text" value={name} onInput={this.onInputName}/>
					</div>
				</section>
				<section class="section-offsets">
					<h2>Offset</h2>
					<OffsetCtrl step={gridOffset} onInput={this.onInputOffset} value={offsetLeft} name="Left" />
					<OffsetCtrl step={gridOffset} onInput={this.onInputOffset} value={offsetRight} name="Right" />
					<OffsetCtrl step={gridOffset} onInput={this.onInputOffset} value={offsetTop} name="Top" />
					<OffsetCtrl step={gridOffset} onInput={this.onInputOffset} value={offsetBottom} name="Bottom" />
				</section>
				<section class="section-anchors">
					<h2>Anchor</h2>
					<AnchorCtrl step={gridAnchor} onInput={this.onInputAnchor} value={anchorLeft} name="Left" max={anchorRight} />
					<AnchorCtrl step={gridAnchor} onInput={this.onInputAnchor} value={anchorRight} name="Right" min={anchorLeft} />
					<AnchorCtrl step={gridAnchor} onInput={this.onInputAnchor} value={anchorTop} name="Top" max={anchorBottom} />
					<AnchorCtrl step={gridAnchor} onInput={this.onInputAnchor} value={anchorBottom} name="Bottom" min={anchorLeft} />
				</section>
				<section class="section-export">
					<h2>Export</h2>
					<Export />
				</section>
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
		gridAnchor: getGridAnchor(state),
		gridOffset: getGridOffset(state),
	};
}

const mapDispatchToProps = {
	setOffset,
	setAnchor,
	setName,
	setGridAnchor,
	setGridOffset,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
