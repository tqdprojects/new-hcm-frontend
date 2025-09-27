import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { usePermissions } from '../Auth/PermissionGuard';

interface MenuAction {
  id: string;
  label: string;
  icon?: React.ComponentType;
  module: string;
  action: string;
  roles?: string[];
  onClick: () => void;
  divider?: boolean;
}

interface RoleBasedMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  actions: MenuAction[];
}

export default function RoleBasedMenu({
  anchorEl,
  open,
  onClose,
  actions,
}: RoleBasedMenuProps) {
  const { hasPermission } = usePermissions();

  const visibleActions = actions.filter(action => 
    hasPermission(action.module, action.action)
  );

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {visibleActions.map((action, index) => (
        <React.Fragment key={action.id}>
          <MenuItem
            onClick={() => {
              action.onClick();
              onClose();
            }}
          >
            {action.icon && (
              <ListItemIcon>
                <action.icon />
              </ListItemIcon>
            )}
            <ListItemText primary={action.label} />
          </MenuItem>
          {action.divider && index < visibleActions.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Menu>
  );
}