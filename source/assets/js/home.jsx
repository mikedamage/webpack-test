import _          from 'lodash';
import React      from 'react';
import { render } from 'react-dom';
import App        from './components/app';

// Component-only styles
import '../css/home';

render(<App />, document.getElementById('app'));
