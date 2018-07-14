import createNotification from "engine/createNotification";
import {randomStrokeSpeed, setStrokeSpeed,} from "game/utils/strokeSpeed";
import {getRandomInclusiveInteger} from "utils/math";
import delay from "utils/delay";
import {setRandomStrokeStyle, setStrokeStyleHandsOff} from "game/enums/StrokeStyle";

/**
 * Task to not touch ones cock
 *
 * @since       15.07.2018
 * @author      the1nstructor
 *
 * @alias       handsOff
 * @memberof    actions
 */
const handsOff = async () => {

  // task duration (= total time in this case)
  const taskDuration = getRandomInclusiveInteger(10, 25);

  createNotification(`Don't you dare touching your cock!`, {
    time: taskDuration * 1000
  });

  setStrokeSpeed(0);
  await setStrokeStyleHandsOff();
  await delay(taskDuration * 1000);

  setStrokeSpeed(randomStrokeSpeed());
  await setRandomStrokeStyle();

};
handsOff.label = "Hands Off";

export default handsOff;
