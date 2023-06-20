import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function ContentListItem({ item }: { item: string }) {
  return (
    <ListItem divider={true}>
      <ListItemText primary={item} />
    </ListItem>
  );
}

interface IContentCardPreview {
  anchorEl: HTMLDivElement | null;
  content: Array<string>;
}

export function ContentCardPreview({ anchorEl, content }: IContentCardPreview) {
  if (!anchorEl) return null;

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
