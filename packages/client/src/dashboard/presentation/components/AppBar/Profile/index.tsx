import { Avatar } from '@mui/material';
import { green } from '@mui/material/colors';

type SHAPE_TYPE = 'rounded' | 'circular' | 'square';

export interface ProfileProps {
  imgSrc?: string;
  name: string;
  shape?: SHAPE_TYPE;
  color?: string; // ex) #ffffff , red
  size?: number; // ex) 48, 56, 64
}

function Profile(props: ProfileProps) {
  const initial = props.name.toUpperCase().substring(0, 1);
  return (
    <Avatar
      variant={props.shape || 'circular'}
      src={props.imgSrc}
      sx={{
        bgcolor: props.color || green[500],
        width: props.size || 56,
        height: props.size || 56,
      }}
    >
      {initial}
    </Avatar>
  );
}

export default Profile;
