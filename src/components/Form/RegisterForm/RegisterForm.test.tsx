import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { vi } from 'vitest';

import {
  RegisterForm,
  type RegisterFormProps,
  type RegisterFormSchemaType,
} from '@/components/Form/RegisterForm/RegisterForm';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    ...props
  }: {
    children?: ReactNode;
  } & ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
}));

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('First Name'), 'John');
  await user.type(screen.getByLabelText('Last Name'), 'Smith');
  await user.type(screen.getByLabelText('Email'), 'john@example.com');
  await user.type(screen.getByLabelText('Password'), 'Password1!');
  await user.type(screen.getByLabelText('Confirm Password'), 'Password1!');
}

describe('RegisterForm', () => {
  function renderComponent(props?: Partial<RegisterFormProps>) {
    const onSubmit: RegisterFormProps['onSubmit'] = vi.fn();

    render(
      <RegisterForm
        onSubmit={onSubmit}
        loading={false}
        data={null}
        error={undefined}
        {...props}
      />
    );

    return { onSubmit };
  }

  it('renders all form fields and submit button', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderComponent();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith(
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        password: 'Password1!',
        confirmPassword: 'Password1!',
      } satisfies RegisterFormSchemaType,
      expect.anything()
    );
  });

  it('does not submit when the email is invalid', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderComponent();

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.type(screen.getByLabelText('Password'), 'Password1!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password1!');

    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('shows an error when passwords do not match', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderComponent();

    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password1!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password1?');

    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Passwords do not match');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows a password validation error for a weak password', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderComponent();

    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.type(screen.getByLabelText('Confirm Password'), 'password');

    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables all inputs when loading is true', () => {
    renderComponent({ loading: true });

    expect(screen.getByLabelText('First Name')).toBeDisabled();
    expect(screen.getByLabelText('Last Name')).toBeDisabled();
    expect(screen.getByLabelText('Email')).toBeDisabled();
    expect(screen.getByLabelText('Password')).toBeDisabled();
    expect(screen.getByLabelText('Confirm Password')).toBeDisabled();
  });

  it('renders the success state when submission is complete', () => {
    renderComponent({
      data: { message: 'SUCCESS' },
    });

    expect(screen.getByText('Success! Redirecting now...')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument();
  });

  it('updates password strength feedback as the user types', async () => {
    const user = userEvent.setup();
    renderComponent();

    const passwordInput = screen.getByLabelText('Password');

    await user.type(passwordInput, 'password');
    expect(screen.queryByText('Very strong')).not.toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, 'Password1!');
    expect(screen.getByText('Very strong')).toBeInTheDocument();
  });
});
