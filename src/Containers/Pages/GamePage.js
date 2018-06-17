import React from "react";
import { Base64 } from "js-base64";
import { withStyles } from "material-ui/styles";
import connect from "hoc/connect";
import { startGame, stopGame } from "game";
import store from "store";
import CustomError from "utils/CustomError";
import { CircularProgress } from "material-ui/Progress";
import Button from "material-ui/Button";
import HUD from "containers/HUD";
import EndPage from "containers/Pages/EndPage";
import MediaPlayer from "components/MediaPlayer";
import { nextSlide } from "game/loops/slideLoop";
import BackgroundImage from "images/background.jpg";

const styles = theme => ({
  progress: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh"
  },
  container: {
    height: "100vh",
    width: "100vw"
  },
  startgame: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: `url(${BackgroundImage})`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed"
  }
});

class GamePage extends React.Component {
  state = {
    gameStarted: false
  };

  constructor(props) {
    super(props);

    const config = Base64.decode(props.match.params.config);

    try {
      store.config = JSON.parse(config);
    } catch (error) {
      throw new CustomError(
        `Unable to decode URL configuration paramaters, ${config}`,
        error
      );
    }

    try {
      // merge local storage config into main config
      store.config.enableVoice = localStorage.getItem("enableVoice")
        ? localStorage.getItem("enableVoice") === "true"
        : true;
    } catch (e) {
      // local storage may not be supported on some devices
    }
    try {
      store.config.enableMoans = localStorage.getItem("enableMoans")
        ? localStorage.getItem("enableMoans") === "true"
        : true;
    } catch (e) {
      // local storage may not be supported on some devices
    }

    if (!store.config.version || store.config.version < 2) {
      debugger;
      throw new CustomError("Sorry but version 1 links are incompatible.");
    }
  }

  componentWillUnmount() {
    stopGame();
  }

  render() {
    if (!this.state.gameStarted) {
      return (
        <div className={this.props.classes.startgame}>
          <Button
            onClick={() => {
              startGame();
              this.setState({ gameStarted: true });
            }}
            variant="raised"
            color="secondary"
          >
            Start Game
          </Button>
        </div>
      );
    }

    if (!this.props.game || !this.props.game.mediaPlayerUrl) {
      return (
        <div className={this.props.classes.progress}>
          <CircularProgress color="secondary" size={100} thickness={2} />
        </div>
      );
    }

    const {
      game: { orgasms, mediaPlayerUrl },
      config: { maximumOrgasms, slideDuration }
    } = this.props;

    return (
      <div className={this.props.classes.container}>
        {maximumOrgasms === orgasms ? (
          <EndPage />
        ) : (
          <React.Fragment>
            <HUD />
            <MediaPlayer
              url={mediaPlayerUrl}
              onEnded={nextSlide}
              duration={slideDuration}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(connect(GamePage));
