import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import { NewsletterBanner } from '@/components/NewsletterBanner/NewsletterBanner';
import type { AsyncState } from '@/types/async';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    type,
    className,
    variant,
  }: {
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    variant?: string;
  }) => (
    <button
      type={type}
      className={className}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/Common/BodyText', () => ({
  BodyText: ({ children }: { children: ReactNode }) => (
    <div data-testid="body-text">{children}</div>
  ),
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children }: { children: ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({ children }: { children: ReactNode }) => (
    <div data-testid="grid-item">{children}</div>
  ),
  Stack: ({ children }: { children: ReactNode }) => <div data-testid="stack">{children}</div>,
}));

describe('NewsletterBanner', () => {
  const getEmailInput = (): HTMLInputElement => screen.getByLabelText('Email address');

  const getSubmitButton = (): HTMLButtonElement =>
    screen.getByRole('button', { name: /subscribe|sending/i });

  it('renders the title and description', () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <NewsletterBanner
        title="Join our newsletter"
        description="Get updates and offers."
        onSubmit={onSubmit}
        state={state}
      />
    );

    expect(screen.getByRole('heading', { name: 'Join our newsletter' })).toBeInTheDocument();
    expect(screen.getByText('Get updates and offers.')).toBeInTheDocument();
    expect(screen.getByTestId('body-text')).toBeInTheDocument();
  });

  it('renders without a description', () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <NewsletterBanner
        title="Join our newsletter"
        onSubmit={onSubmit}
        state={state}
      />
    );

    expect(screen.getByRole('heading', { name: 'Join our newsletter' })).toBeInTheDocument();
    expect(screen.queryByText('Get updates and offers.')).not.toBeInTheDocument();
  });

  it('renders the form when state is not success', () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <NewsletterBanner
        title="Newsletter"
        onSubmit={onSubmit}
        state={state}
      />
    );

    expect(getEmailInput()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
    expect(getSubmitButton()).toHaveTextContent('Subscribe');
  });

  it('hides the form when state is success', () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<{ message: string }> = {
      status: 'success',
      data: { message: 'Thanks!' },
    };

    render(
      <NewsletterBanner
        title="Newsletter"
        onSubmit={onSubmit}
        state={state}
      />
    );

    expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /subscribe|sending/i })).not.toBeInTheDocument();
  });

  it('disables the email field and shows "Sending..." while loading', () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<unknown> = { status: 'loading' };

    render(
      <NewsletterBanner
        title="Newsletter"
        onSubmit={onSubmit}
        state={state}
      />
    );

    expect(getEmailInput()).toBeDisabled();
    expect(getSubmitButton()).toHaveTextContent('Sending...');
  });

  it('keeps the email field enabled and shows "Subscribe" when not loading', () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <NewsletterBanner
        title="Newsletter"
        onSubmit={onSubmit}
        state={state}
      />
    );

    expect(getEmailInput()).not.toBeDisabled();
    expect(getSubmitButton()).toHaveTextContent('Subscribe');
  });

  it('submits valid email values', async () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <NewsletterBanner
        title="Newsletter"
        onSubmit={onSubmit}
        state={state}
      />
    );

    fireEvent.change(getEmailInput(), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' }, expect.anything());
  });

  it('does not submit invalid email values', async () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <NewsletterBanner
        title="Newsletter"
        onSubmit={onSubmit}
        state={state}
      />
    );

    fireEvent.change(getEmailInput(), {
      target: { value: 'not-an-email' },
    });

    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('shows the validation message as the placeholder when email is invalid', async () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <NewsletterBanner
        title="Newsletter"
        onSubmit={onSubmit}
        state={state}
      />
    );

    const input = getEmailInput();

    expect(input).toHaveAttribute('placeholder', 'Enter your email');
    expect(input).toHaveAttribute('data-valid', 'true');

    fireEvent.change(input, {
      target: { value: 'bad-email' },
    });

    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(input).toHaveAttribute('placeholder', 'Please enter a valid email!');
    });

    expect(input).toHaveAttribute('data-valid', 'false');
  });

  it('marks the field as valid when there is no email error', () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <NewsletterBanner
        title="Newsletter"
        onSubmit={onSubmit}
        state={state}
      />
    );

    expect(getEmailInput()).toHaveAttribute('data-valid', 'true');
    expect(getEmailInput()).toHaveAttribute('placeholder', 'Enter your email');
  });

  it('renders the layout wrappers', () => {
    const onSubmit: SubmitHandler<{ email: string }> = vi.fn();
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <NewsletterBanner
        title="Newsletter"
        description="Updates and offers."
        onSubmit={onSubmit}
        state={state}
      />
    );

    expect(screen.getByTestId('container')).toBeInTheDocument();

    const grids = screen.getAllByTestId('grid');
    const gridItems = screen.getAllByTestId('grid-item');

    expect(grids.length).toBeGreaterThan(0);
    expect(gridItems.length).toBeGreaterThan(0);
    expect(screen.getByTestId('stack')).toBeInTheDocument();
  });
});
