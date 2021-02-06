import classNames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

export const NavBar: React.FC<{}> = () => {
    const menuItems = [
        { name: 'Tasks', link: '/' },
        { name: 'Shows', link: '/shows' },
        { name: 'Imprint', link: '/imprint' },
    ];

    const path = useRouter().pathname;

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav className="mr-auto">
                {menuItems.map((item) => (
                    <Nav.Link
                        key={item.name}
                        href={item.link}
                        className={classNames([
                            'nav-item',
                            { active: item.link === path },
                        ])}
                    >
                        {item.name}
                    </Nav.Link>
                ))}
            </Nav>
        </Navbar>
    );
};
