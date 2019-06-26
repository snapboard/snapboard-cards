import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
// const req2 = require.context('../cards', true, /component\/(Card\.js|styles\.css)$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
  // req2.keys().forEach(filename => req2(filename));
}

configure(loadStories, module);
