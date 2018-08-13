import store from "store";
import moment from "moment";
import { randomStrokeSpeed } from "game/utils/strokeSpeed";
import { StrokeStyleEnum } from "game/enums/StrokeStyle";

export default () => {
  store.game = {
    startTime: new moment(),
    pictures: [],
    pictureIndex: -1,
    mediaPlayerUrl: null,
    mediaFrozen: false,
    strokeSpeed: randomStrokeSpeed(),
    bookmarks: [],
    gripStrength: store.config.initialGripStrength,
    rubberBands: 0,
    clothespins: 0,
    cockAndBallsBound: false,
    ruins: 0,
    edges: 0,
    orgasms: 0,
    strokes: 0,
    strokeWave: [],
    strokeStyle: StrokeStyleEnum.dominant,
    buttPlugInserted: false,

    // even if only chosen orgasm one may be denied in the end
    chanceForDenial: 0, //percent
    // edging Ladder
    edgingLadder: false,
    edgingLadderLength: 2,
    edgingLadderRung: 0,
    edgingLadderCooldowns: 1,  //every 4 ladder edges one long cooldown is required
  };
};
