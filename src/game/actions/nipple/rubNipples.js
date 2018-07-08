import createNotification from "engine/createNotification";
import {randomStrokeSpeed, setStrokeSpeed,} from "game/utils/strokeSpeed";
import {RubStrengthString} from "game/enums/RubStrength";
import {getRandomInclusiveInteger} from "utils/math";
import delay from "utils/delay";
import {setRandomStrokeStyle, setStrokeStyleHandsOff} from "game/actions/strokeStyle";

/**
 * Task to rub ones nipples while not touching ones cock.
 *
 * @since       06.07.2018
 * @author      the1nstructor
 *
 * @alias       rubNipples
 * @memberof    actions
 */
const rubNipples = async () => {
    // set intensity
    const intensity = getRandomInclusiveInteger(0, 4);

    // task duration (= total time in this case)
    const taskDuration = getRandomInclusiveInteger(10, 25);

    createNotification(`Use both of your hands to ${RubStrengthString[intensity]}rub your nipples`, {
        time: taskDuration * 1000
    });

    setStrokeSpeed(0);
    setStrokeStyleHandsOff();
    await delay((taskDuration + 1) * 1000);

    setStrokeSpeed(randomStrokeSpeed());
    setRandomStrokeStyle();

};
rubNipples.label = "Rub Nipples";

export default rubNipples;
