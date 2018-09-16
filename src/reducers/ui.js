// actions
export const UI_BOX_SELECT = 'ui:box:select';

// action creators
export function selectBox(box = '') {
	return { type: UI_BOX_SELECT, box };
}

// reducer
const initialState = {
	selectedBox: '',
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case UI_BOX_SELECT:
			return {
				...state,
				selectedBox: action.box,
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
