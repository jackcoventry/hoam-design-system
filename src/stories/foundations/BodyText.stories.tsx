import bodyText from '@/styles/BodyText.module.css';

const Template = () => {
  return (
    <section>
      <article className={bodyText.root}>
        <h1>Body text example</h1>
        <h2>Subheading</h2>
        <p>This is a paragraph with body text styling.</p>
        <p>Another paragraph to demonstrate the body text style.</p>
        <img
          src="https://placehold.co/600x400/EEE/31343C"
          alt="Example"
        />
        <p>This is a paragraph following an image to show spacing.</p>
        <ul>
          <li>First item in a list</li>
          <li>Second item in a list</li>
          <li>Third item in a list</li>
        </ul>
        <p>Final paragraph to conclude the body text example.</p>
      </article>
    </section>
  );
};

export default {
  title: 'Foundations/Body Text',
  component: Template,
  argTypes: {},
};

export const Example = {
  args: {},
};
