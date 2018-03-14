/**
 * Your header documentation here for _listen
 *    For your reference...
 *      event will hold an Event object with the pixels in
 *      event.detail.data and the timestamp in event.timeStamp
 */

// Using 2 dimensional array to store the 5x5 tap code
const tapCode = [['e','t','a','n','d'],['o','i','r','u','c'],['s','h','m','f','p'],['l','y','g','v','j'],['w','b','x','q','z']];

let code = [];
let referenceBrightness = 0, currentBrightness = 0, startTime = 0, endTime = 0,  timeDiff = 0;
let hasStarted = false, status = true, preTermination;
const THRESHOLD = 50;

_listen = function(event)
{   
    let greyscale = [];

    // Converting the RGBA values to greyscale
    for (let counter = 0; counter < event.detail.data.length; counter +=4 ) {
        let average = (event.detail.data[counter]+event.detail.data[counter+1]+event.detail.data[counter+2])/3;
        greyscale.push(average);

    }

    // Assume that the brightness level remains the same
    // for the first few milliseconds, we 
    // get hold of the brightness level as reference as NO-TAP

    // Get the average of middle 10 pixels
    currentBrightness = greyscale.slice(195,205).reduce((elem1,elem2) => elem1 +elem2) / 10;

    if (referenceBrightness === 0) {
        referenceBrightness = currentBrightness;        
    }

    // Starting the timer when first encounter a flash
    if (status === true && currentBrightness > referenceBrightness + THRESHOLD) {

        code.push("*");

        // Check if half gap is way longer than the tap
        ((event.timeStamp - endTime) > timeDiff + 40) ? code.push(" ") : code.push("");

        startTime = event.timeStamp;
        hasStarted = true;
        status = false; 
    }

    // End the timer when first encounter no flash
    if (hasStarted && currentBrightness < referenceBrightness + THRESHOLD) {

        endTime = event.timeStamp;
        timeDiff = endTime - startTime;
        hasStarted = false;
        status = true;
    }

    // Checking for premature termination
    ((event.timeStamp - endTime) > 4*timeDiff) ? preTermination = true: preTermination = false;
};

/**
 * Resets all the data to be able to for call the
 * listen function once again
 */
clear = function()
{
    // your code here
    code = [];
    referenceBrightness = 0;
    currentBrightness = 0;
    startTime = 0;
    endTime = 0;
    timeDiff = 0;
    hasStarted = false, status = true;
    document.getElementById("rx-translated").innerHTML = "";

};

/**
 * Translates the tap code into human-readable format
 * Includes checking if 
 */
translate = function()
{

    let tmp = code.join("");
    let subCode = tmp.split(" ").slice(1);
    let translatedStr = "";
    console.log(tmp);
    console.log(subCode);

    for (let i = 0; i < subCode.length -1 ; i += 2)
    {
        let row = subCode[i].length - 1;
        let column = subCode[i+1].length - 1;
        let char = tapCode[row][column];
        translatedStr += char;
    }

    translatedStr = translatedStr.replace(/(wuw)/g, " ");
    translatedStr = translatedStr.replace(/(qc)/g, "k");



    if (preTermination) {
        document.getElementById("rx-translated").innerHTML = translatedStr;
    } else {
        document.getElementById("rx-translated").innerHTML = translatedStr + " (Premature Termination)";
    }
};

