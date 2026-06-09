import type { Meta, StoryObj } from '@storybook/react-vite';

import { BodyText } from '@/components/Common/BodyText';
import { Container, Section } from '@/components/Layout';

import styles from './Introduction.module.css';

function IntroductionPage() {
  return (
    <main className={styles.root}>
      <Section
        as="div"
        space="xl"
      >
        <Container width="wide">
          <div className={styles.hero}>
            <p className={styles.eyebrow}>Welcome</p>
            <h1 className={styles.title}>HOAM Design System</h1>
            <p className={styles.intro}>
              A practical component library for HOAM storefront experiences. It brings together the
              reusable React components, design tokens, and page patterns used to build warm,
              focused commerce interfaces.
            </p>

            <div className={styles.actions}>
              <a
                className={styles.primaryLink}
                href="https://hoam-store.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                View the dev store
              </a>
              <a
                className={styles.secondaryLink}
                href="/?path=/story/components-button--primary"
              >
                Explore components
              </a>
            </div>
          </div>

          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>What is included</h2>
            <div className={styles.panelGrid}>
              <article className={styles.panel}>
                <h3 className={styles.panelTitle}>Components</h3>
                <p className={styles.panelText}>
                  Navigation, product tiles, forms, modals, banners, filters, baskets, and other
                  commerce-focused building blocks.
                </p>
              </article>

              <article className={styles.panel}>
                <h3 className={styles.panelTitle}>Foundations</h3>
                <p className={styles.panelText}>
                  Shared colours, typography, spacing, layout primitives, icons, and motion tokens.
                </p>
              </article>

              <article className={styles.panel}>
                <h3 className={styles.panelTitle}>Page examples</h3>
                <p className={styles.panelText}>
                  Example screens that show how components combine for search, product discovery,
                  account journeys, articles, and basket flows.
                </p>
              </article>
            </div>
          </section>

          <section className={styles.storePanel}>
            <BodyText as="div">
              <h2 className={styles.storeTitle}>See it in context</h2>
              <p className={styles.storeText}>
                The HOAM dev store is a Next.js storefront currently using this design system. It is
                the best place to see how the components feel in a more realistic product
                experience, outside the isolated Storybook canvas.
              </p>
            </BodyText>

            <a
              className={styles.primaryLink}
              href="https://hoam-store.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open hoam-store.vercel.app
            </a>
          </section>

          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>How to use this Storybook</h2>
            <ul className={styles.list}>
              <li>Start with page stories to understand the intended shopping experience.</li>
              <li>Use component stories when you need implementation details or states.</li>
              <li>Check foundations when you need shared colours, type, spacing, or icons.</li>
            </ul>
          </section>
        </Container>
      </Section>
    </main>
  );
}

const meta = {
  title: 'Introduction',
  component: IntroductionPage,
  parameters: {
    layout: 'fullscreen',
    controls: {
      disable: true,
    },
  },
} satisfies Meta<typeof IntroductionPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Welcome: Story = {};
