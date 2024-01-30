import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ access_token: 'mocked-access-token', id: 'mocked-id' }),
  })
);

describe('Login Component', () => {
  it('renders the login form with email and password inputs', () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText('Sähköposti');
    const passwordInput = screen.getByPlaceholderText('Salasana');
    const submitButton = screen.getByRole('button', { name: 'Kirjaudu' });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('submits the form with valid input', async () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText('Sähköposti');
    const passwordInput = screen.getByPlaceholderText('Salasana');
    const submitButton = screen.getByRole('button', { name: 'Kirjaudu' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Kirjautuminen epäonnistui!/i)).toBeInTheDocument();
    });
  });
});
