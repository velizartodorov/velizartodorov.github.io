import { ReactNode } from 'react';

export interface Properties {
  title: string;
  children: ReactNode;
  className?: string;
  eventKey?: string;
}
