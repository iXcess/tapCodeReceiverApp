/**
 * Codeprocessor.js performs backend code processing of the received video stream data.
 * This data is then translated into a predefined human-readable format and displayed in the browser.
 * 
 * Contributor:
 * Kok Yuan Ting    29269016
 * Lau Lee Yan
 * Anamfatimah
 * Liew Ze Ching
 *
 * Last modified : 15/3/18
 */

const THRESHOLD = 50;
let code = [];
let referenceBrightness = 0, currentBrightness = 0, startTime = 0, endTime = 0,  timeDiff = 0;
let hasStarted = false, darkness = true, preTermination = null;
let rxTranslated = document.getElementById("rx-translated");
let rxCode = document.getElementById("rx-code");
let output = '';

_listen = function(event)
{   
    let greyscale = [];

    // Converting the RGBA values to greyscale
    for (let counter = 0; counter < event.detail.data.length; counter +=4 ) {
        let average = (event.detail.data[counter]+event.detail.data[counter+1]+event.detail.data[counter+2])/3;
        greyscale.push(average);

    }

    // Get the average of middle 10 pixels
    currentBrightness = greyscale.slice(195,205).reduce((elem1,elem2) => elem1 +elem2) / 10;

    // Brightness level remains the same for the first few milliseconds, we 
    // get hold of the brightness level as reference as NO-TAP
    if (referenceBrightness === 0) {
        referenceBrightness = currentBrightness;        
    }

    // Starting the timer when first encounter a flash
    if (darkness === true && currentBrightness > referenceBrightness + THRESHOLD) {

        // Check if half gap is way longer than the tap
        ((event.timeStamp - endTime) > timeDiff + 50) ? code.push(" ") : code.push("");
		
        code.push("*");
		output = code.join("");
		rxCode.innerHTML = output;
		
        startTime = event.timeStamp;
        hasStarted = true;
        darkness = false; 
    }

    // End the timer when first encounter no flash
    if (hasStarted && currentBrightness < referenceBrightness + THRESHOLD) {

        endTime = event.timeStamp;
        timeDiff = endTime - startTime;
        hasStarted = false;
        darkness = true;
    }

    // Checking for premature termination
    ((event.timeStamp - endTime) > 4*timeDiff) ? preTermination = true: preTermination = false;
    
};

/**
 * Resets all the data to be able to for call the listen function once again
 */
clear = function()
{
    code = [];
    referenceBrightness = 0; currentBrightness = 0; startTime = 0; endTime = 0; timeDiff = 0;
    hasStarted = false, darkness = true;
    rxTranslated.innerHTML = ""; rxCode.innerHTML = "";
};

/**
 * Translates the tap code into human-readable format and display the results in the inner HTML tag
 */
translate = function()
{
    // Using 2 dimensional array to store the 5x5 tap code
    const tapCode = [['e','t','a','n','d'],['o','i','r','u','c'],['s','h','m','f','p'],['l','y','g','v','j'],['w','b','x','q','z']];

    let tmp = code.join("");
    let subCode = tmp.split(" ").slice(1);
    let translatedStr = "";

    for (let i = 0; i < subCode.length -1 ; i += 2)
    {
        let row = subCode[i].length - 1;
        let column = subCode[i+1].length - 1;
        let char = tapCode[row][column];
        translatedStr += char;
    }

    // Using regex replacement expression, refer to 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    translatedStr = translatedStr.replace(/(wuw)/g, " ");
    translatedStr = translatedStr.replace(/(qc)/g, "k");

    // Setting the output
    rxCode.innerHTML = tmp;
    (preTermination) ? rxTranslated.innerHTML = translatedStr : rxTranslated.innerHTML = translatedStr + " (Premature Termination)";
};
