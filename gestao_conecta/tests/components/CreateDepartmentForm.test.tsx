import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateDepartmentForm from '@/app/(admin)/dashboard/departamentos/CreateDepartmentForm';

// Mock the action
jest.mock('@/actions/admin', () => ({
  createDepartment: jest.fn().mockResolvedValue({ error: null })
}));

// Mock react's useActionState
jest.mock('react', () => {
  const original = jest.requireActual('react');
  return {
    ...original,
    useActionState: (action: any, initialState: any) => {
      return [initialState, action, false];
    }
  };
});

describe('CreateDepartmentForm', () => {
  it('renders input and submit button', () => {
    render(<CreateDepartmentForm />);
    expect(screen.getByPlaceholderText('Nome do departamento')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeInTheDocument();
  });

  it('allows user to type department name', () => {
    render(<CreateDepartmentForm />);
    const input = screen.getByPlaceholderText('Nome do departamento');
    fireEvent.change(input, { target: { value: 'Obras' } });
    expect(input).toHaveValue('Obras');
  });
});
