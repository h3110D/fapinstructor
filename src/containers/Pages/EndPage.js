import React from "react";
import store from "store";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Feedback from "components/Feedback";
import BackgroundImage from "images/background.jpg";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: `url(${BackgroundImage})`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed"
  },
  bookmarks: {
    marginTop: 10
  }
});

const EndPage = ({ classes }) => (
  <div className={classes.root}>
    <Typography
      variant="display3"
      color="inherit"
      style={{ fontFamily: "'Damion', cursive" }}
    >
      The End
    </Typography>
    <Typography variant="body2" gutterBottom>
      I hope you enjoyed the game. If you have any feedback or feature requests
      please let me know on reddit or open an issue on GitHub!
    </Typography>
    <Feedback />
    {store.game.bookmarks.length > 0 && (
      <div className={classes.bookmarks}>
        <Typography variant="title" noWrap gutterBottom>
          Bookmarks
        </Typography>
        {store.game.bookmarks.map(bookmark => (
          <div key={bookmark}>
            <a href={bookmark} target="_blank" rel="noopener noreferrer">
              <Typography noWrap gutterBottom>
                {bookmark}
              </Typography>
            </a>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default withStyles(styles)(EndPage);
