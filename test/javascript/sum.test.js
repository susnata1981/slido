import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'

import HelloWorld from 'components/HelloWorld';

it('Hello test', () => {
  render(<HelloWorld/>)
  expect(screen.getByText(/Greeting/)).toBeInTheDocument();
});


