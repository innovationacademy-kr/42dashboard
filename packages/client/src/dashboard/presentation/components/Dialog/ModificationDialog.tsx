import {
  AppBar,
  Dialog,
  IconButton,
  List,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { EntityColumn } from 'common/src';
import EntityListItem from './EntityListItem';
import { changeFirstCharToLowercase } from '../Modal/makeStickerData';

export interface ModificationDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ModificationDialog(props: ModificationDialogProps) {
  const { open, setOpen } = props;

  function returnEntityColumnItems() {
    return Object.keys(EntityColumn).map((entityName: string) => {
      if (entityName === 'User') return null;
      return (
        <EntityListItem
          key={entityName}
          entityName={changeFirstCharToLowercase(entityName)}
        />
      );
    });
  }

  function finishModification() {
    setOpen(false);
  }

  return (
    <Dialog fullScreen open={open}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={finishModification}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            수정하기
          </Typography>
        </Toolbar>
      </AppBar>
      <List>{returnEntityColumnItems()}</List>
    </Dialog>
  );
}
