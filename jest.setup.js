// import '@testing-library/jest-dom/extend-expect';
// jest.setup.js
// require('@testing-library/jest-dom/extend-expect');

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const jestDom = require('@testing-library/jest-dom');
expect.extend(jestDom);