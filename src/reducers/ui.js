// actions
export const UI_BOX_SELECT = 'ui:box:select';
export const UI_DRAGGING_SET = 'ui:dragging:set';
export const UI_GRID_SET = 'ui:grid:set';

// action creators
export function selectBox(box = '') {
	return { type: UI_BOX_SELECT, box };
}
export function setDragging(id = '') {
	return { type: UI_DRAGGING_SET, id };
}
export function setGrid(grid = 0) {
	return { type: UI_GRID_SET, grid };
}

// reducer
const initialState = {
	selectedBox: '',
	dragging: '',
	grid: 0,
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case UI_BOX_SELECT:
			return {
				...state,
				selectedBox: action.box === 'root' ? '' : action.box,
			};
		case UI_DRAGGING_SET:
			return {
				...state,
				dragging: action.id,
			};
		case UI_GRID_SET:
			return {
				...state,
				grid: action.grid,
			};
		default:
			return state;
	}
}

// selectors
export const getState = ({ ui = {} } = {}) => ui;
export const getSelectedBox = (state) => {
	const { selectedBox = '' } = getState(state);
	return selectedBox;
};
export const getDragging = (state) => {
	const { dragging = '' } = getState(state);
	return dragging;
};
export const getGrid = (state) => {
	const { grid = 0 } = getState(state);
	return grid;
};
