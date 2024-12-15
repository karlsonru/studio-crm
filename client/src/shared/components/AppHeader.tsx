import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Toolbar,
  Typography,
  IconButton,
  Stack,
  Popover,
  Button,
  Card,
  CardActions,
} from '@mui/material';
import { useAppSelector } from '../hooks/useAppSelector';
import { useMobile } from '../hooks/useMobile';
import { useActionCreators } from '../hooks/useActionCreators';
import { authActions } from '../reducers/authSlice';

interface IExitButton {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  setOpen: (value: boolean) => void;
  userLogin: ReactNode | null;
}

function ExitButton({
  isOpen,
  setOpen,
  anchorEl,
  userLogin,
}: IExitButton) {
  const navigate = useNavigate();
  const actions = useActionCreators(authActions);

  const handleClick = () => {
    actions.setToken(null);
    actions.setLogin(null);

    navigate('/auth');
  };

  const ExitButtonSmall = () => <Button
      size="small"
      variant="outlined"
      color="error"
      onClick={handleClick}
    >
      Выход
    </Button>;

  return <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={() => setOpen(false)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Card sx={{ p: 1 }}>
        { userLogin }
        <CardActions>
          <ExitButtonSmall />
        </CardActions>
      </Card>
  </Popover>;
}

function UserInfo() {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const userLogin = useAppSelector((state) => state.authReducer.login);

  if (!userLogin) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const UserLogin = <Typography variant="h6">{ userLogin }</Typography>;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
    >
      {!isMobile && UserLogin }
      <IconButton color="inherit" onClick={handleClick}>
        <AccountCircleIcon fontSize="large" />
      </IconButton>
      <ExitButton
        anchorEl={anchorEl}
        isOpen={isOpen}
        setOpen={setIsOpen}
        userLogin={isMobile ? UserLogin : null}
      />
    </Stack>
  );
}

export function AppHeader({ menuIcon }: { menuIcon: ReactNode }) {
  const title = useAppSelector((state) => state.appMenuReducer.title);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#7da69e' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        marginX={2}
      >
        <Toolbar>
            { menuIcon }
          <Typography variant="h6" noWrap component="div">
            { title }
          </Typography>
        </Toolbar>
        <UserInfo />
      </Stack>
    </AppBar>
  );
}
