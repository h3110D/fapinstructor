import createNotification from "engine/createNotification";
import {randomStrokeSpeed, setStrokeSpeed,} from "game/utils/strokeSpeed";
import {RubStrengthEnum, RubStrengthString} from "game/enums/RubStrength"
import {HandSideEnum, HandSideString} from "game/enums/HandSide";
import {getRandomInclusiveInteger} from "utils/math";
import delay from "utils/delay";
import {setRandomStrokeStyle, setRandomStrokeStyle_OneHand} from "game/actions/strokeStyle";

/**
 * Task to rub ones nipples while stroking ones cock.
 *
 * @since      06.07.2018
 *
 * @alias   nipplesAndStroke
 * @memberof actions
 */
const nipplesAndStroke = async () => {
    // set intensity
    const intensity = getRandomInclusiveInteger(0, Object.keys(RubStrengthEnum).length/2);

    const left_or_right = getRandomInclusiveInteger(0, Object.keys(HandSideEnum).length/2);
    //TODO: always getting "right" so getRandomInclusiveInteger(0, 1) either always returns 0 or Object.keys is wrong calculation.

    // task duration (= total time in this case)
    const taskDuration = getRandomInclusiveInteger(10, 25);

    setRandomStrokeStyle_OneHand();
    createNotification(`Use one of your hands to ${RubStrengthString[intensity]}rub your ${HandSideString[left_or_right]} nipple`, {
        time: taskDuration * 1000
    });

    await delay((taskDuration + 1) * 1000);

    setStrokeSpeed(randomStrokeSpeed());
    setRandomStrokeStyle();

};
nipplesAndStroke.label = "Rub Nipples";

export default nipplesAndStroke;
