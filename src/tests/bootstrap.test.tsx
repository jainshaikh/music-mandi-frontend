import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

describe("bootstrap tooling", () => {
  it("merges class names via cn()", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("renders a shadcn/ui component", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });
});
