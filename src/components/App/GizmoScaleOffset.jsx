import { h } from 'preact';
import GizmoOffset from './GizmoOffset';

import './GizmoScaleOffset.css';

export default function GizmoScaleOffset({
	id = '',
}) {
	return (
		<div class="gizmo-group gizmo-scale-offset">
			{/* edges */}
			<GizmoOffset boxId={id} offsets={['top']} />
			<GizmoOffset boxId={id} offsets={['bottom']} />
			<GizmoOffset boxId={id} offsets={['left']} />
			<GizmoOffset boxId={id} offsets={['right']} />
			{/* corners */}
			<GizmoOffset boxId={id} offsets={['top','left']} />
			<GizmoOffset boxId={id} offsets={['bottom','left']} />
			<GizmoOffset boxId={id} offsets={['top','right']} />
			<GizmoOffset boxId={id} offsets={['bottom','right']} />
		</div>
	);
}
