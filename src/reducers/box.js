import { generate } from 'shortid';
import { getSelectedBox } from "./ui";
import { clamp } from '../utils';

// actions
export const BOX_CREATE = 'box:create';
export const BOX_NAME_SET = 'box:name:set';
export const BOX_OFFSET_SET = 'box:offset:set';
export const BOX_ANCHOR_SET = 'box:anchor:set';

// action creators
export function createBox(parent = 'root') {
	return { type: BOX_CREATE, id: generate(), parent };
}

export function setOffset({ id = '', offsetLeft = 0, offsetRight = 0, offsetTop = 0, offsetBottom = 0 }) {
	return { type: BOX_OFFSET_SET, id, offsetLeft, offsetRight, offsetTop, offsetBottom };
}

export function setAnchor({ id = '', anchorLeft = 0, anchorRight = 0, anchorTop = 0, anchorBottom = 0 }) {
	return { type: BOX_ANCHOR_SET, id, anchorLeft, anchorRight, anchorTop, anchorBottom };
}

// reducer

const initialBox = {
	// px offset from anchor
	offsetLeft: 0,
	offsetRight: 0,
	offsetTop: 0,
	offsetBottom: 0,
	// % anchor from parent
	anchorLeft: 0,
	anchorRight: 1,
	anchorTop: 0,
	anchorBottom: 1,
};
const initialState = {
	byId: {
		root: initialBox,
	},
	children: {
		root: [],
	},
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case BOX_CREATE:
			return {
				...state,
				byId: {
					...state.byId,
					[action.id]: initialBox,
				},
				children: {
					...state.children,
					[action.parent]: state.children[action.parent].concat(action.id),
					[action.id]: [],
				},
			};
		case BOX_OFFSET_SET:
		case BOX_ANCHOR_SET:
			return {
				...state,
				byId: {
					...state.byId,
					[action.id]: reducerBox(state.byId[action.id], action),
				},
			}
		default:
			return state;
	}
}

export function reducerBox(state = initialBox, action) {
	switch (action.type) {
		case BOX_OFFSET_SET:
			return {
				...state,
				offsetLeft: action.offsetLeft,
				offsetRight: action.offsetRight,
				offsetTop: action.offsetTop,
				offsetBottom: action.offsetBottom,
			};
		case BOX_ANCHOR_SET:
			return {
				...state,
				anchorLeft: clamp(0, action.anchorLeft, action.anchorRight),
				anchorRight: clamp(action.anchorLeft, action.anchorRight, 1),
				anchorTop: clamp(0, action.anchorTop, action.anchorBottom),
				anchorBottom: clamp(action.anchorTop, action.anchorBottom, 1),
			};
	}
}

// selectors
export const getState = ({ box = {} } = {}) => box;
export const getById = (state) => {
	const { byId = {} } = getState(state);
	return byId;
};
export const getBoxById = (state, id) => {
	const {
		[id]: box = {},
	} = getById(state, id);
	return box;
};
export const getSelectedBoxObj = (state) => {
	const id = getSelectedBox(state);
	return getBoxById(state, id);
};
export const getChildren = (state) => {
	const { children = {} } = getState(state);
	return children;
};
export const getChildrenForId = (state, id) => {
	const {
		[id]: children = []
	} = getChildren(state);
	return children;
};
