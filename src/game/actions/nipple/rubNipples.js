import createNotification from "engine/createNotification";
import {randomStrokeSpeed, setStrokeSpeed,} from "game/utils/strokeSpeed";
import {RubStrengthString} from "game/enums/RubStrength"
import {getRandomInclusiveInteger} from "utils/math";
import delay from "utils/delay";

const rubNipples = async () => {
    // set intensity
    //TODO: Maybe create an enum
    const intensity = getRandomInclusiveInteger(0, 4);

    // task duration (= total time in this case)
    const taskDuration = getRandomInclusiveInteger(4, 15);

    createNotification(`Use both of your hands to ${RubStrengthString[intensity]}rub your nipples`, {
        time: taskDuration * 1000
    });

    setStrokeSpeed(0);
    await delay(taskDuration * 1000);

    setStrokeSpeed(randomStrokeSpeed());
};
rubNipples.label = "Rub Nipples";

export default rubNipples;
