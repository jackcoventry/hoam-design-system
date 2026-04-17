import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { vi } from 'vitest';

import {
  SignInForm,
  type SignInFormProps,
  type SignInFormSchemaType,
} from '@/components/Form/SignIn/SignIn';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    ...props
  }: {
    children?: ReactNode;
  } & ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
}));

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
  await user.type(screen.getByPlaceholderText('Enter your password'), 'abcde');
}

describe('SignInForm', () => {
  function renderComponent(props?: Partial<SignInFormProps>) {
    const onSubmit: SignInFormProps['onSubmit'] = vi.fn();

    render(
      <SignInForm
        onSubmit={onSubmit}
        loading={false}
        data={null}
        error={undefined}
        {...props}
      />
    );

    return { onSubmit };
  }

  it('renders the form fields and submit button', () => {
    renderComponent();

    expect(screen.getByRole('heading', { level: 2, name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderComponent();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith(
      {
        email_address: 'john@example.com',
        password: 'abcde',
      } satisfies SignInFormSchemaType,
      expect.anything()
    );
  });

  it('does not submit when the email is invalid', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderComponent();

    await user.type(screen.getByPlaceholderText('Enter your email'), 'not-an-email');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'abcde');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('does not submit when the password is too short', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderComponent();

    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), '1234');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('shows an error for an invalid email', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByPlaceholderText('Enter your email'), 'not-an-email');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'abcde');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('shows an error for a short password', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), '1234');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Password must be at least 5 characters'
    );
  });

  it('disables both inputs when loading is true', () => {
    renderComponent({ loading: true });

    expect(screen.getByPlaceholderText('Enter your email')).toBeDisabled();
    expect(screen.getByPlaceholderText('Enter your password')).toBeDisabled();
  });

  it('renders the success state when submission is complete', () => {
    renderComponent({
      data: { message: 'SUCCESS' },
    });

    expect(screen.getByText('Success! Redirecting now...')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign in' })).not.toBeInTheDocument();
  });
});
