import React, { FC } from 'react';
import { HeaderWrapper } from './Header.styled';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => (
 <HeaderWrapper>
    Header Component
 </HeaderWrapper>
);

export default Header;
