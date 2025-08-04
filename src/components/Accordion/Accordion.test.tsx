import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Accordion, {
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from "@/components/Accordion/Accordion";

describe("Accordion", () => {
  it("renders collapsed by default and toggles sections", () => {
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
    fireEvent.click(screen.getByRole("button", { name: "One" }));
    expect(screen.getByText("Panel One")).toBeVisible();
  });

  it("expand/collapse toggle works for all sections", () => {
    render(
      <Accordion defaultOpenIds={[]}>
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
    const toggleBtn = screen.getByRole("button", {
      name: "Expand all sections",
    });
    fireEvent.click(toggleBtn);
    expect(screen.getByText("Panel One")).toBeVisible();
    expect(screen.getByText("Panel Two")).toBeVisible();
    fireEvent.click(toggleBtn);
    expect(screen.queryByText("Panel One")).toBeNull();
    expect(screen.queryByText("Panel Two")).toBeNull();
  });

  it("controlled mode calls onChange", () => {
    const handleChange = vi.fn();
    render(
      <Accordion openIds={[]} onChange={handleChange}>
        <AccordionItem id="one">
          <AccordionHeader>One</AccordionHeader>
          <AccordionPanel>Panel One</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
    fireEvent.click(screen.getByRole("button", { name: "One" }));
    expect(handleChange).toHaveBeenCalledWith(["one"]);
  });

  it("keyboard navigation with expand/collapse toggle first", () => {
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
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAccessibleName("Expand all sections");
    expect(buttons[1]).toHaveAccessibleName("One");
    expect(buttons[2]).toHaveAccessibleName("Two");
  });
});
