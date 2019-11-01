function createKeyframeObject(parent, isNewKeyframe = false) {
	let obj = {};
	let success = true;

	parent.childNodes.forEach(td => {
		if (td.nodeName == "TD") {
			td.childNodes.forEach(element => {
				if (element.nodeName == "INPUT") {
					if (element.type == "color") {
						let colorObj = hexToRgb(element.value);
						if (!colorObj) {
							success = false;
						}
						else {
							obj["colorR"] = colorObj.r;
							obj["colorG"] = colorObj.g;
							obj["colorB"] = colorObj.b;
						}
					}
					else if (element.type == "number") {
						let val = parseInt(element.value);

						if (val <= parseInt(element.max) && val >= parseInt(element.min)) {
							obj[element.name] = val;
						}
						else {
							success = false;
						}
					}
					if (isNewKeyframe)
						element.value = "";
				}
			});
		}
	});
	if (success) {
		return obj;
	}
	return false;
}

function createKeyframesView(keyFrames) {
	keyFrames.forEach(elem => {
		createOneKeyframeView(elem);
	});
}

function createOneKeyframeView(element) {
	let parent = document.getElementById("keyframes_table_body");
	let elem = document.getElementById("add_keyframe");

	let tr = document.createElement("tr");

	tr.appendChild(createInputTd("number", "left", element.left, "0-550", 0, 550));
	tr.appendChild(createInputTd("number", "top", element.top, "0-550", 0, 550));
	tr.appendChild(createInputTd("color", "color", rgbToHex(element.colorR, element.colorG, element.colorB)));
	tr.appendChild(createInputTd("number", "angle", element.angle, "0-360", 0, 360));
	tr.appendChild(createInputTd("number", "percent", element.percent, "%", 0, 100));

	let td = document.createElement("td");
	let span = document.createElement("span");
	span.setAttribute("class", "remove_keyframe_btn");
	span.innerHTML = "&times;";
	td.appendChild(span);
	tr.appendChild(td);

	parent.insertBefore(tr, elem);
}

function createInputTd(type = "text", name, value, placeholder, min, max) {
	let td = document.createElement("td");
	if (value != "disabled") {
			let input = document.createElement("input");
		input.setAttribute("type", type);
		input.setAttribute("name", name);
		input.setAttribute("value", value);
		if (placeholder !== undefined)
			input.setAttribute("placeholder", placeholder);
		if (min !== undefined)
			input.setAttribute("min", min);
		if (max !== undefined)
			input.setAttribute("max", max);

		td.appendChild(input);
	}


	return td;
}

function componentToHex(c) {
	let hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function getCheckedRadioValue(name) {
	let radios = document.getElementsByName(name);
	for (let i in radios) {
		if (radios[i].checked) {
			return radios[i].value;
		}
	}
}
