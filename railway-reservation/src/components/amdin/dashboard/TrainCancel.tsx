import {
  Avatar,
  Card,
  CardContent,
  CardOwnProps,
  Typography
} from '@mui/material';
import { Grid } from '@mui/material';
import CancelIcon from '@mui/material/Icon';
import { CommonProps } from '@mui/material/OverridableComponent';
import { red } from '@mui/material/colors';
import { ElementType } from 'react';
import { JSX } from 'react/jsx-runtime';

const TrainCancel = (props: JSX.IntrinsicAttributes & { component: ElementType<any, keyof JSX.IntrinsicElements>; } & CardOwnProps & CommonProps & Omit<any, "className" | "style" | "classes" | "children" | "elevation" | "square" | "sx" | "variant" | "raised">) => (
  <Card
    sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
         <Grid>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="h6"
          >
            TRAIN
          </Typography>
          <Typography
            color="textPrimary"
            variant="h3"
          >
            Cancellations
          </Typography>
        </Grid>
        <Grid >
          <Avatar
            sx={{
              backgroundColor: red[600],
              height: 56,
              width: 56
            }}
          >
            <CancelIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default TrainCancel;
