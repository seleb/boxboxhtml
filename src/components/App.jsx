import { h, Component } from 'preact';

import './App.css';
import Box from './App/Box';
import Editor from './App/Editor';
import Outliner from './App/Outliner';

export default function App() {
	return (
		<div class="app">
			<main>
				<Outliner />
				<section class="boxes">
					<Box id="root" />
				</section>
				<Editor />
			</main>
			<footer>
				<h2>css ui thingy</h2>
				<a href="https://twitter.com/SeanSLeBlanc">Contact</a>
			</footer>
		</div>
	);
}
