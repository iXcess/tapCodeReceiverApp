/**
 * Your header documentation here for _listen
 *    For your reference...
 * 		event will hold an Event object with the pixels in
 *   	event.detail.data and the timestamp in event.timeStamp
 */

 let isTapped = [];
 let referenceBrightness = 0, currentTime;
 const THRESHOLD = 20;

_listen = function(event)
{
	let greyscale = [];
	let currentBrightness;

	// To check what kind of data is being logged ( for debugging )
	// console.log(event.detail.data);
	console.log(event.timeStamp);

	for (let counter = 0; counter < event.detail.data.length; counter +=4 ) {
		let average = (event.detail.data[counter]+event.detail.data[counter+1]+event.detail.data[counter+2])/3;
		greyscale.push(average);

	}

	// Assume that the brightness level remains the same
	// for the first 200ms ( average of 10 values), we 
	// get hold of the brightness level as reference as NO-TAP

	// Get the average of first 10 pixels
	let averageValue = greyscale.slice(0,10).reduce((elem1,elem2) => elem1 +elem2) / 10;

	if (event.timeStamp < 200) {

		if (referenceBrightness === 0 ) {
			referenceBrightness = averageValue;
		} else {
			referenceBrightness = (referenceBrightness + averageValue)/2;
		}
		
	} else {
		currentBrightness = averageValue;
	}

	// Starting the timer
	if (currentBrightness > referenceBrightness + THRESHOLD) {
		currentTime = event.timeStamp;
		isTapped[0] = true;
	}


	
	(referenceBrightness > currentBrightness + THRESHOLD) ? isTapped.push(true) : isTapped.push(false);

	//console.log(isTapped);
};

/**
 * Your header documentation here for clear
 */
clear = function()
{
	// your code here
};

/**
 * Your header documentation here for translate
 */
translate = function()
{
	// your code here
};

// Using 2 dimensional array to store the 5x5 tap code
const TAPCODE = [['e','t','a','n','d'],['o','i','r','u','c'],['s','h','m','f','p'],['l','y','g','v','j'],['w','b','x','q','z']];

