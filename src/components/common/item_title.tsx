import { FC, ReactNode } from 'react';

const ItemTitle: FC<{ children: ReactNode }> = ({ children }) => (
    <h5 className="mb-0 text-xl font-semibold tracking-[-0.02em] max-sm:text-base max-sm:font-normal">{children}</h5>
);

export default ItemTitle;
