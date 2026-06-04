import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Accordion, AccordionItem } from '@/components/Accordion';
import { Button } from '@/components/Button';
import { Modal, ModalStackProvider } from '@/components/Modal';
import { ProductInfo } from '@/components/ProductInfo';
import ProductInformationMockData from '@/mocks/components/ProductInformation';

import { assertNoAxeViolations, runAxe } from '../../../config/a11y';

describe('Accessibility smoke tests', () => {
  it('renders Button variants without axe violations', async () => {
    const { container } = render(
      <main>
        <Button type="button">Shop coffee</Button>
        <Button
          type="button"
          icon="search"
          iconOnly
          aria-label="Search coffees"
        />
      </main>
    );

    const results = await runAxe(container);

    expect(results.violations).toBeDefined();
    assertNoAxeViolations(results);
  });

  it('renders Accordion markup without axe violations', async () => {
    const { container } = render(
      <main>
        <Accordion
          allowMultiple
          defaultOpenIds={['details']}
        >
          <AccordionItem
            id="details"
            title="Details"
          >
            Seasonal espresso blend.
          </AccordionItem>

          <AccordionItem
            id="delivery"
            title="Delivery"
          >
            Ships in 1-2 business days.
          </AccordionItem>
        </Accordion>
      </main>
    );

    const results = await runAxe(container);

    assertNoAxeViolations(results);
  });

  it('renders ProductInfo without axe violations', async () => {
    const { container } = render(
      <main>
        <ProductInfo
          title="House Espresso Blend"
          description="Balanced espresso coffee with chocolate sweetness and citrus brightness."
          productId="house-espresso-blend"
          price={{ amount: 18, saleAmount: 15 }}
          inStock
          newItem
          lowStock
          data={ProductInformationMockData}
          onSubmit={() => {}}
          isSubmitting={false}
        />
      </main>
    );

    const results = await runAxe(container);

    assertNoAxeViolations(results);
  });

  it('renders an open Modal without axe violations', async () => {
    const { baseElement } = render(
      <ModalStackProvider>
        <main>
          <p>Storefront content</p>
        </main>

        <Modal
          isOpen
          aria-label="Coffee details"
        >
          <Modal.Header>
            <Modal.Title>Coffee details</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body>
            <p>Brown sugar, orange zest, and milk chocolate.</p>
          </Modal.Body>

          <Modal.Footer>
            <Button type="button">Add to basket</Button>
          </Modal.Footer>
        </Modal>
      </ModalStackProvider>
    );

    const results = await runAxe(baseElement);

    assertNoAxeViolations(results);
  });
});
