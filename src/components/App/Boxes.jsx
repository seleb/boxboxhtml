import { h, Component } from 'preact';

import './Boxes.css';
import Box from './Box';

export default function Boxes() {
	return (
		<section class="boxes">
			<Box id="root" />
		</section>
	);
}
