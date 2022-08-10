import { Avatar, IconButton } from '@mui/material';
import { green } from '@mui/material/colors';
type SHAPE_TYPE = 'rounded' | 'circular' | 'square';

export interface ProfileProps {
  imgSrc?: string;
  name: string;
  shape?: SHAPE_TYPE;
  color?: string; // ex) #ffffff , red
  size?: number; // ex) 48, 56, 64
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function Profile(props: ProfileProps) {
  const initial = props.name.substring(0, 1).toUpperCase();

  return (
    <IconButton size="medium" onClick={props.onClick}>
      <Avatar
        variant={props.shape || 'circular'}
        src={props.imgSrc}
        sx={{
          bgcolor: props.color || '#1976d2',
          width: props.size || 56,
          height: props.size || 56,
          boxShadow:
            '0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%)',
        }}
      >
        {initial}
      </Avatar>
    </IconButton>
  );
}

export default Profile;
