import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Switch } from '@/components/Switch';

describe('Switch', () => {
  it('renders an accessible switch with a label', () => {
    render(<Switch label="Enable notifications" />);

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument();
  });

  it('calls onCheckedChange when toggled', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <Switch
        label="Enable notifications"
        onCheckedChange={handleCheckedChange}
      />
    );

    await user.click(screen.getByRole('switch', { name: 'Enable notifications' }));

    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('supports description text', () => {
    render(
      <Switch
        label="Enable notifications"
        description="Receive updates about important account activity."
      />
    );

    expect(
      screen.getByText('Receive updates about important account activity.')
    ).toBeInTheDocument();
  });

  it('supports disabled state', () => {
    render(
      <Switch
        label="Enable notifications"
        disabled
      />
    );

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeDisabled();
  });
});
