import { createContext } from 'react';

export const InTimelineContext = createContext(false);

export const RailNodeContext = createContext<{ isFirst: boolean; isLast: boolean }>({ isFirst: false, isLast: false });

export const EntryIdContext = createContext<string | null>(null);
