import { combineReducers } from 'redux';

import ui from './reducers/ui';
import box from './reducers/box';

export default combineReducers({
	ui,
	box,
});
