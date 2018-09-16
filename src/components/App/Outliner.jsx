import { h, Component } from 'preact';

import './Outliner.css';
import OutlinerEntry from './OutlinerEntry';

export default function Outliner() {
	return (
		<section class="outliner">
			<OutlinerEntry id="root" />
		</section>
	);
}
