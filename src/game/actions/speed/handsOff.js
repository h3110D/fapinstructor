import createNotification from "engine/createNotification";
import { getRandomStrokeSpeed, setStrokeSpeed, } from "game/utils/strokeSpeed";
import { getRandomInclusiveInteger } from "utils/math";
import delay from "utils/delay";
import { getCurrentStrokeStyle, setStrokeStyle, setStrokeStyleHandsOff } from "game/enums/StrokeStyle";
import { getRandom_handsOff_message } from "game/texts/messages";

/**
 * Task to not touch ones cock
 *
 * @param duration
 *   The duration how long the break shall last in s
 *
 * @since       15.07.2018
 * @author      the1nstructor
 *
 * @alias       handsOff
 * @memberof    actions
 */
const handsOff = async (duration = getRandomInclusiveInteger(10, 25)) => {

  const style = getCurrentStrokeStyle();
  // task duration (= total time in this case)
  const m = getRandom_handsOff_message();
  createNotification(m, {
    time: duration * 1000
  });

  setStrokeSpeed(0);
  await setStrokeStyleHandsOff();
  await delay((duration + 1) * 1000);

  createNotification("Start stroking again");

  setStrokeSpeed(getRandomStrokeSpeed());
  await setStrokeStyle(style);
  await delay(1000);

};
handsOff.label = "Hands Off";

export default handsOff;
