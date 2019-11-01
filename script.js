window.onload = function() {
	start();
};

function start() {
	let defaultKeyFrames = [
		{left: 0, top: 0, colorR: 255, colorG: 0, colorB: 0, angle: 0, percent: "disabled"},
		{left: 150, top: 360, colorR: 0, colorG: 255, colorB: 255, angle: 360, percent: 50},
		{left: 350, top: 100, colorR: 255, colorG: 255, colorB: 0, angle: 150, percent: 25},
		{left: 534, top: 413, colorR: 0, colorG: 88, colorB: 132, angle: 200, percent: 25},
	];
	defaultKeyFrames.percentSum = 100;

	let defaultTime = getCheckedRadioValue("duration");
	let defaultIterationCount = getCheckedRadioValue("iteration_count");
	let defaultSpeed = getCheckedRadioValue("fixed_speed");

	createKeyframesView(defaultKeyFrames);

	let playPauseElem = document.getElementById("play_pause");
	let reverseElem = document.getElementById("reverse");
	let applyElem = document.getElementById("apply");
	let rangeElem = document.getElementById("range");

	let obj = new Animate(document.getElementById("object"));
	obj.init(defaultKeyFrames, defaultTime, defaultIterationCount, defaultSpeed);
	obj.play();

	/* events */
	playPauseElem.onclick = function(e) {
		obj.togglePlay();
	}

	rangeElem.oninput = function(e) {
		obj.seek(e.target.value);
	}

	reverseElem.onclick = function(e) {
		obj.toggleDirection();
	}

	applyElem.onclick = function(e) {
		let newKeyframes = [];
		newKeyframes.percentSum = 0;

		let newTime = getCheckedRadioValue("duration");
		let newIterationCount = getCheckedRadioValue("iteration_count");
		let newSpeed = getCheckedRadioValue("fixed_speed");

		document.getElementById("keyframes_table_body").childNodes.forEach(elem => {
			if (elem.nodeName == "TR") {
				let valuesObject = createKeyframeObject(elem);
				if (valuesObject) {
					newKeyframes.push(valuesObject);
					newKeyframes.percentSum += valuesObject.percent ? valuesObject.percent : 0;
				}
			}
		});
		if (obj.init(newKeyframes, newTime, newIterationCount, newSpeed)) {
			obj.restart();
		}
	}

	document.addEventListener('click',function(e){
		if (e.target && e.target.className == 'add_keyframe_btn'){
			let element = createKeyframeObject(e.target.parentNode.parentNode, true);
			if (element) {
				createOneKeyframeView(element);
			}
		}
		else if (e.target && e.target.className == 'remove_keyframe_btn'){
			e.target.parentNode.parentNode.remove();
		}
	});
}
