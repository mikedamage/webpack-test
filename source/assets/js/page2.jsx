import _          from 'lodash';
import React      from 'react';
import { render } from 'react-dom';
import TextBox    from './components/text-box';

render(<TextBox label="Your Name:" msgLabel="Your name is:" />, document.getElementById('app'));
