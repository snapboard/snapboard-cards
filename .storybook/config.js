import { configure } from '@storybook/react';
import './base.css'

// automatically import all files ending in *.sb.js
const req = require.context('../stories', true, /\.sb\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
