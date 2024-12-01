import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useMobile } from '../../shared/hooks/useMobile';

function ContentListItem({ item }: { item: string | null }) {
  if (item === null) return null;

  return (
    <ListItem
      divider={true}
      secondaryAction={null}
    >
      <ListItemText primary={item} />
    </ListItem>
  );
}

interface IContentCardPreview {
  anchorEl: HTMLDivElement | null;
  content: Array<string | null>;
}

export function ContentCardPreview({ anchorEl, content }: IContentCardPreview) {
  if (!anchorEl) return null;

  const isMobile = useMobile();

  if (isMobile) return null;

  const width = anchorEl.offsetWidth;

  return (
    <Popover
      disableAutoFocus
      open={!!anchorEl}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      sx={{
        pointerEvents: 'none',
      }}
    >
      <List sx={{ width }}>
        { content.map((item) => <ContentListItem key={item} item={item} />) }
      </List>
    </Popover>
  );
}
