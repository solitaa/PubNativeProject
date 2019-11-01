class Animate {
	constructor(objToAnimate) {
		this.domElem = objToAnimate;
		this.playPauseElem = document.getElementById("play_pause");
		this.rangeElem = document.getElementById("range");
		this.allStepsCount = 500;
		this.direction = 1; /* -1 is reverse direction */
		this.intervalTime; /* Iteration time of setInterval (millisecond) */
		this.state = ""; /* Three possible values: "running", "paused", "" - means not started */
		this.iterationCount; /* Two possible values: "Infinite", "one time" */
		this.fixedSpeed; /* Two possible values: 1 - fixed speed, 0 - speed depends on percentage */

		this.leftStep = 0;
		this.topStep = 0;
		this.colorRStep = 0;
		this.colorGStep = 0;
		this.colorBStep = 0;
		this.angleStep = 0;

		this.activeKeyframeNum = 1;
		/* Active step number for current keyframe */
		this.activeStepNum = 1;
		/* Active step number for the whole animation */
		this.activeStepNumAnim = 1;

		this.keyframes;
		this.interval;
	}

	init(keyFrames, time, iterationCount, speed) {
		if (keyFrames.length <= 2 || keyFrames.percentSum != 100 && speed == 0)
			return false;

		this.intervalTime = time * 1000 / this.allStepsCount;
		this.iterationCount = iterationCount;
		this.fixedSpeed = parseInt(speed);

		let allLen = 0;

		if (this.fixedSpeed) {
			/* Calculating the length of the animation (pixels) to distribute the steps for each keyframe */
			for (let i = 1; i < keyFrames.length; i++) {
				let len = Math.sqrt(Math.pow(keyFrames[i].top - keyFrames[i - 1].top, 2) + Math.pow(keyFrames[i].left - keyFrames[i - 1].left, 2));
				keyFrames[i].len = len;
				allLen += len;
			}
		}

		for (let i = 1; i < keyFrames.length; i++) {
			if (this.fixedSpeed) {
				keyFrames[i].steps = Math.round(keyFrames[i].len * this.allStepsCount / allLen);
			}
			else {
				keyFrames[i].steps = Math.round(this.allStepsCount * keyFrames[i].percent / 100);
			}
			/* The properties that ends with "...Step" are used to know the exact difference between steps */
			keyFrames[i].topStep = (keyFrames[i].top - keyFrames[i - 1].top) / keyFrames[i].steps;
			keyFrames[i].leftStep = (keyFrames[i].left - keyFrames[i - 1].left) / keyFrames[i].steps;
			keyFrames[i].colorRStep = (keyFrames[i].colorR - keyFrames[i - 1].colorR) / keyFrames[i].steps;
			keyFrames[i].colorGStep = (keyFrames[i].colorG - keyFrames[i - 1].colorG) / keyFrames[i].steps;
			keyFrames[i].colorBStep = (keyFrames[i].colorB - keyFrames[i - 1].colorB) / keyFrames[i].steps;
			keyFrames[i].angleStep = (keyFrames[i].angle - keyFrames[i - 1].angle) / keyFrames[i].steps;
		}

		this.keyframes = keyFrames;
		return true;
	}

	step(n = 1) {
		let activeKeyframe = this.keyframes[this.activeKeyframeNum];

		/* Changing the value of active step and active keyframe once the maximum value attained (animation ends) */
		while (this.activeStepNum > activeKeyframe.steps || this.activeStepNum < 0) {
			this.activeKeyframeNum += this.direction * 1;
			if (!this.keyframes[this.activeKeyframeNum] || this.activeKeyframeNum == 0) {
				this.reset();
				if (this.iterationCount != "infinite") {
					this.stop();
				}
				return;
			}
			if (this.direction == -1)
				this.activeStepNum = this.keyframes[this.activeKeyframeNum].steps + this.activeStepNum;
			else
				this.activeStepNum = this.activeStepNum - activeKeyframe.steps;

			activeKeyframe = this.keyframes[this.activeKeyframeNum];
		}

		let preiousKeyframe = this.keyframes[this.activeKeyframeNum - 1];
		/* Multiplying by this.direction to move the animation in right direction (-1 - active step number decreases, 1 - active step number increases)*/
		this.activeStepNumAnim += this.direction * n;
		this.activeStepNum += this.direction * n;
		this.rangeElem.value = this.activeStepNumAnim;

		/* Changing css properties of the element */
		this.changePropDist("top", preiousKeyframe["top"] + this.activeStepNum * activeKeyframe["topStep"]);
		this.changePropDist("left", preiousKeyframe["left"] + this.activeStepNum * activeKeyframe["leftStep"]);
		this.changePropColor(Math.floor(preiousKeyframe["colorR"] + this.activeStepNum * activeKeyframe["colorRStep"]),
							Math.floor(preiousKeyframe["colorG"] + this.activeStepNum * activeKeyframe["colorGStep"]),
							Math.floor(preiousKeyframe["colorB"] + this.activeStepNum * activeKeyframe["colorBStep"]));
		this.changePropAngle(preiousKeyframe["angle"] + this.activeStepNum * activeKeyframe["angleStep"]);
	}

	changePropDist(dir, newCord) {
		this.domElem.style[dir] = newCord + "px";
	}

	changePropColor(r, g, b) {
		this.domElem.style["background-image"] = "linear-gradient(to bottom, rgba(" + (r|0) + "," + (g|0) + "," + (b|0) + ",0.7), rgba(" + (r|0) + "," + (g|0) + "," + (b|0) + ",1))";
	}

	changePropAngle(angle) {
		this.domElem.style["transform"] = "rotate(" + (angle|0) + "deg)";
	}

	togglePlay() {
		if (this.state == "paused") {
			this.state = "running";
			this.play();
		}
		else if(this.state == "running" || this.state == ""){
			this.state = "paused";
			this.stop();
		}
	}

	stop() {
		clearInterval(this.interval);
		this.playPauseElem.innerHTML = "Play";
		this.state = "paused";
	}

	play() {
		this.interval = setInterval(() => {
			this.step();
		}, this.intervalTime);
		this.playPauseElem.innerHTML = "Pause";
		this.state = "running";
	}

	reset() {
		if (this.direction == -1) {
			let lastKeyframe = this.keyframes[this.keyframes.length - 1];
			this.activeKeyframeNum = this.keyframes.length - 1;
			this.activeStepNum = lastKeyframe.steps;
			this.activeStepNumAnim = this.allStepsCount;
		}
		else {
			this.activeKeyframeNum = 1;
			this.activeStepNum = 1;
			this.activeStepNumAnim = 1;
		}
	}

	restart() {
		this.stop();
		this.reset();
		this.play();
	}

	toggleDirection() {
		this.direction *= -1;
	}

	seek(rangeVal) {
		let diff = rangeVal - this.activeStepNumAnim;
		let existingDirection = this.direction;
		if (diff < 0) {
			this.direction = -1;
		}
		else {
			this.direction = 1;
		}
		this.step(Math.abs(diff));
		this.direction = existingDirection;
	}
}
