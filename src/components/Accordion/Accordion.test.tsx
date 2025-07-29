import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Accordion, {
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from "@/components/Accordion/Accordion";

describe("AccessibleAccordion", () => {
  it("renders all items collapsed by default", () => {
    render(
      <Accordion>
        <AccordionItem id="one">
          <AccordionHeader>One</AccordionHeader>
          <AccordionPanel>Panel One</AccordionPanel>
        </AccordionItem>
        <AccordionItem id="two">
          <AccordionHeader>Two</AccordionHeader>
          <AccordionPanel>Panel Two</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.queryByText("Panel One")).toBeNull();
    expect(screen.queryByText("Panel Two")).toBeNull();
  });

  it("opens and closes items on click in uncontrolled mode", () => {
    render(
      <Accordion defaultOpenIds={["one"]}>
        <AccordionItem id="one">
          <AccordionHeader>One</AccordionHeader>
          <AccordionPanel>Panel One</AccordionPanel>
        </AccordionItem>
        <AccordionItem id="two">
          <AccordionHeader>Two</AccordionHeader>
          <AccordionPanel>Panel Two</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("Panel One")).toBeVisible();
    fireEvent.click(screen.getByText("One"));
    expect(screen.queryByText("Panel One")).toBeNull();
  });

  it("allows multiple items open when allowMultiple is true", () => {
    render(
      <Accordion allowMultiple>
        <AccordionItem id="one">
          <AccordionHeader>One</AccordionHeader>
          <AccordionPanel>Panel One</AccordionPanel>
        </AccordionItem>
        <AccordionItem id="two">
          <AccordionHeader>Two</AccordionHeader>
          <AccordionPanel>Panel Two</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
    fireEvent.click(screen.getByText("One"));
    fireEvent.click(screen.getByText("Two"));
    expect(screen.getByText("Panel One")).toBeVisible();
    expect(screen.getByText("Panel Two")).toBeVisible();
  });

  it("calls onChange in controlled mode", () => {
    const handleChange = vi.fn();
    render(
      <Accordion openIds={[]} onChange={handleChange}>
        <AccordionItem id="one">
          <AccordionHeader>One</AccordionHeader>
          <AccordionPanel>Panel One</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
    fireEvent.click(screen.getByText("One"));
    expect(handleChange).toHaveBeenCalledWith(["one"]);
  });

  it("supports keyboard navigation", () => {
    render(
      <Accordion>
        <AccordionItem id="one">
          <AccordionHeader>One</AccordionHeader>
          <AccordionPanel>Panel One</AccordionPanel>
        </AccordionItem>
        <AccordionItem id="two">
          <AccordionHeader>Two</AccordionHeader>
          <AccordionPanel>Panel Two</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
    const firstHeader = screen.getByText("One");
    firstHeader.focus();
    fireEvent.keyDown(firstHeader, { key: "ArrowDown" });
    expect(screen.getByText("Two")).toHaveFocus();
  });
});
