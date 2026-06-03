import { render, screen } from '@testing-library/react';

import { Radio, RadioGroup } from '@/components/Form/Radio';

describe('RadioGroup', () => {
  it('renders a semantic group with legend', () => {
    render(
      <RadioGroup legend="Preferred contact method">
        <Radio
          name="contact"
          label="Email"
          value="email"
        />
        <Radio
          name="contact"
          label="Store pickup"
          value="store-pickup"
        />
      </RadioGroup>
    );

    expect(screen.getByRole('group', { name: 'Preferred contact method' })).toBeInTheDocument();
  });

  it('renders description and associates it with the fieldset', () => {
    render(
      <RadioGroup
        legend="Preferred contact method"
        description="Choose one option."
      >
        <Radio
          name="contact"
          label="Email"
          value="email"
        />
      </RadioGroup>
    );

    const group = screen.getByRole('group', { name: 'Preferred contact method' });
    const description = screen.getByText('Choose one option.');

    expect(group).toHaveAttribute('aria-describedby', description.id);
  });

  it('renders error text and associates it with the fieldset', () => {
    render(
      <RadioGroup
        legend="Preferred contact method"
        error="Please select a contact method."
      >
        <Radio
          name="contact"
          label="Email"
          value="email"
        />
      </RadioGroup>
    );

    const group = screen.getByRole('group', { name: 'Preferred contact method' });
    const error = screen.getByText('Please select a contact method.');

    expect(group).toHaveAttribute('aria-describedby', error.id);
  });

  it('associates both description and error when both are present', () => {
    render(
      <RadioGroup
        legend="Preferred contact method"
        description="Choose one option."
        error="Please select a contact method."
      >
        <Radio
          name="contact"
          label="Email"
          value="email"
        />
      </RadioGroup>
    );

    const group = screen.getByRole('group', { name: 'Preferred contact method' });
    const description = screen.getByText('Choose one option.');
    const error = screen.getByText('Please select a contact method.');

    expect(group).toHaveAttribute('aria-describedby', `${description.id} ${error.id}`);
  });
});
