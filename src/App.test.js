import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MapDrawShape', async () => {
  render(<App />);
  const titleElement = screen.getByText(/Google Maps Draw Shape/i);
  expect(titleElement).toBeInTheDocument();

  const mapContainer = screen.getByText((content, element) => {
    return element.className.toLowerCase() === 'map-container';
  });
  expect(mapContainer).toBeInTheDocument();
});