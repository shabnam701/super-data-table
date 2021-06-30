import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

test('renders learn react link', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  // const linkElement = screen.getByText(/Acme/i);
  // expect(linkElement).toBeInTheDocument();
});
