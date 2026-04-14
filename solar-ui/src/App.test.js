import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the solar inspection dashboard', () => {
  render(<App />);
  expect(screen.getByText(/solar inspection dashboard/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /run detection/i })).toBeInTheDocument();
});
