import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter as Router } from 'react-router-dom';
import App from './App';

jest.mock('./services/Login', () => () => <div>Login Component</div>);
jest.mock('./main_components/DoctorHome', () => () => <div>DoctorHome Component</div>);
jest.mock('./main_components/ClientHome', () => () => <div>ClientHome Component</div>);
jest.mock('./services/AuthCheck', () => ({ children }) => <div>{children}</div>);
jest.mock('./services/CheckRole', () => ({ children }) => <div>{children}</div>);

describe('App Component', () => {
  it('renders login page when path is not matched', () => {
    render(
      <Router initialEntries={['/invalid-path']}>
        <App />
      </Router>
    );

    const loginPageElement = screen.getByText(/Login Component/i);
    expect(loginPageElement).toBeInTheDocument();
  });

  it('renders DoctorHome when path is /doctor-dashboard', async () => {
    render(
      <Router initialEntries={['/doctor-dashboard']}>
        <App />
      </Router>
    );

    await waitFor(() => {
      const doctorHomeElement = screen.getByText(/DoctorHome Component/i);
      expect(doctorHomeElement).toBeInTheDocument();
    });
  });

  it('renders ClientHome when path is /client-dashboard', async () => {
    render(
      <Router initialEntries={['/client-dashboard']}>
        <App />
      </Router>
    );

    await waitFor(() => {
      const clientHomeElement = screen.getByText(/ClientHome Component/i);
      expect(clientHomeElement).toBeInTheDocument();
    });
  });
});
