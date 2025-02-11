import { memo, useState } from 'react';
import { ButtonArrow, ButtonCustom, Container } from './styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface MenuItemType {
  label: string;
  onClick: () => void;
}

interface ButtonMenuProps {
  label: string;
  onDetailClick: () => void;
  menuItems: MenuItemType[];
}

const ButtonMenu: React.FC<ButtonMenuProps> = ({ label, onDetailClick, menuItems }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (onClick: () => void) => {
    handleClose();
    onClick();
  };

  return (
    <Container>
      <ButtonCustom onClick={onDetailClick}>{label}</ButtonCustom>
      <ButtonArrow
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <ArrowDropDownIcon />
      </ButtonArrow>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={() => handleMenuItemClick(item.onClick)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Container>
  );
};

export default memo(ButtonMenu);
