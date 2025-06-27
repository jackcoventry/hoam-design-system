import { useState } from "react";
import { Button } from "@/components/Button/Button";
import Tokens from "@/design-tokens/icons.json";

const CopyButton = ({ icon }) => {
  const [copied, setStatus] = useState(false);
  const copyCodeBlock = () => {
    navigator.clipboard
      .writeText(
        `
		<svg
			className="icon"
			width="1em"
			height="1em"
			fill="currentColor"
		>
			<use xlinkHref="/icons/icons.svg#${icon}" />
		</svg>
	`
      )
      .then(
        () => {
          setStatus(true);
          setTimeout(() => {
            setStatus();
          }, 3000);
        },
        () => {
          setStatus();
        }
      );
  };

  return (
    <Button
      type="button"
      onClick={copyCodeBlock}
      variant={copied ? "tertiary" : "primary"}
      className="w-full"
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
};

const Template = () => (
  <>
    <div className="container">
      <div className="grid">
        <div className="g-col-12">
          <h1>Icons</h1>
        </div>
        <div className="g-col-12">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Example</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              {Tokens?.icons?.map((e) => (
                <tr key={e}>
                  <td>{e}</td>
                  <td>
                    <svg
                      className="icon"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                    >
                      <use xlinkHref={`/icons/icons.svg#${e}`} />
                    </svg>
                  </td>
                  <td>
                    <CopyButton icon={e} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>
);

export default {
  title: "Foundations/Icons",
  component: Template,
  argTypes: {},
};

export const Example = {
  args: {},
};
