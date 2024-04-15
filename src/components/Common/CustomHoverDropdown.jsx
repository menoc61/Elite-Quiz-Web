import React, { useState } from 'react'

const CustomHoverDropdown = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuOpenOne, setMenuOpenOne] = useState(false);

    const toggleMenuOpen = (open) => {
      setMenuOpen(open);
    };

    const toggleMenuOpenOne = (open) => {
        setMenuOpenOne(open);
    };

    const handlers = {
      onMouseEnter: () => toggleMenuOpen(true),
      onMouseLeave: () => toggleMenuOpen(false),
    };

    const handlersOne = {
        onMouseEnter: () => toggleMenuOpenOne(true),
        onMouseLeave: () => toggleMenuOpenOne(false),
    };

    return { menuOpen, handlers, menuOpenOne, handlersOne};
}

export default CustomHoverDropdown