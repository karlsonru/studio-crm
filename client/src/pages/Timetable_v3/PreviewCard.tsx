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

interface IContentList {
  content: Array<string>;
  width: number;
}

function ContentList({ content, width }: IContentList) {
  return (
    <List sx={{ width }}>
      { content.map(
        (item) => <ContentListItem key={item} item={item} />,
      ) }
    </List>
  );
}

interface IContentCardPreview {
  anchorEl: HTMLDivElement | null;
  handleClose: () => void;
  content: Array<string>;
}

export function ContentCardPreview({ anchorEl, content, handleClose }: IContentCardPreview) {
  const width = anchorEl?.offsetWidth;

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
    >
      <ContentList content={content} width={width ?? 0} />
    </Popover>
  );
}
