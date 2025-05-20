import React from "react";
import { GradientButton } from "./gradient-button";

export function GradientButtonDemo() {
  return (
    <div className="flex flex-wrap justify-center items-center p-4 gap-2 bg-background rounded-lg border border-border">
      <GradientButton variant="gradient1">Gradient 01</GradientButton>
      <GradientButton variant="gradient2">Gradient 02</GradientButton>
      <GradientButton variant="gradient3">Gradient Shadow</GradientButton>
      <GradientButton variant="gradient4">Gradient Raise</GradientButton>
      <GradientButton variant="gradient5">Gradient Slide Up</GradientButton>
      <GradientButton variant="gradient6">Gradient Slide Right</GradientButton>
      <GradientButton variant="gradient7">Gradient Slide Down</GradientButton>
      <GradientButton variant="gradient8">Infinity Gradient</GradientButton>
      <GradientButton variant="gradient9">Gradient Border 01</GradientButton>
      <GradientButton variant="gradient10">Gradient Border 02</GradientButton>
      <GradientButton variant="gradient11">Gradient Text 01</GradientButton>
      <GradientButton variant="gradient12">Gradient Text 02</GradientButton>
      
      {/* Size variants */}
      <div className="w-full flex flex-wrap justify-center items-center mt-6">
        <GradientButton variant="gradient1" size="sm">Small Button</GradientButton>
        <GradientButton variant="gradient1">Default Button</GradientButton>
        <GradientButton variant="gradient1" size="lg">Large Button</GradientButton>
      </div>
    </div>
  );
}
