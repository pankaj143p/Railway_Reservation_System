import {
  Avatar,
  Card,
  CardContent,
  CardOwnProps,
  Grid,
  Typography
} from '@mui/material';
import AccessTimeFilledIcon from '@mui/material/Icon';
import { CommonProps } from '@mui/material/OverridableComponent';
import { purple } from '@mui/material/colors';
import { ElementType } from 'react';
import { JSX } from 'react/jsx-runtime';

const TrainSchedule = (props: JSX.IntrinsicAttributes & { component: ElementType<any, keyof JSX.IntrinsicElements>; } & CardOwnProps & CommonProps & Omit<any, "className" | "style" | "classes" | "children" | "elevation" | "square" | "sx" | "variant" | "raised">) => (
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
        <Grid >
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
            Schedule
          </Typography>
        </Grid>
        <Grid>
          <Avatar
            sx={{
              backgroundColor: purple[600],
              height: 56,
              width: 56
            }}
          >
            <AccessTimeFilledIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default TrainSchedule;
