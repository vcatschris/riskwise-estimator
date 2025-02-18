
import React from 'react';
import { CardDescription, CardTitle } from '@/components/ui/card';

interface StepTitleProps {
  title: string;
  description: string;
}

export function StepTitle({ title, description }: StepTitleProps) {
  return (
    <>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </>
  );
}
