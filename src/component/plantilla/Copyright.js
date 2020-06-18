import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {  makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
const useStyles = makeStyles(theme => ({
  pie:{
    margin:'25px'
  }
}));

function Copyright() {
  const classes = useStyles();
    return (
<Box mt={8}>
      <Typography variant="body2" color="textSecondary" align="center" className={classes.pie}>
        {'Copyright © '}
        <Link color="inherit" href="https://atijaguar.com/">
          Atijaguar Cía. Ltda.
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      </Box>
    );
  }

  export default Copyright
