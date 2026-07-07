import { FC, ReactNode } from 'react';

const DividedList: FC<{ children: ReactNode }> = ({ children }) => (
    <ul className="divide-app-border divide-y">{children}</ul>
);

export default DividedList;
