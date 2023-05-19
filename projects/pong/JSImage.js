// JS HTML graphics "library" by Max Xiang

class JSImage {
	static n_elements = 0;
	element;
	image;
	_x;
	_y;
	constructor(src, x, y) {
		// note: if your image is small, ie (5px)^2, the positioning will be wrong.
		this.element = document.createElement(`randosTringnubmer${JSImage.n_elements}asd`);
		JSImage.n_elements++;
		this.element.style = `position: absolute; left: ${x}px; top: ${y}px`;
		this.image = new Image();
		this.image.src = src;
		this.element.appendChild(this.image);
		document.body.appendChild(this.element);
		this._x = x;
		this._y = y;
	}
	Move(x, y) {
		this.element.style = `position: absolute; left: ${x}px; top: ${y}px;`;
		this._x = x;
		this._y = y;
	}
	AbsoluteSize(w, h) {
		this.image.width = w;
		this.image.height = h;
	}
}
class JSTextBox {
	static n_elements = 0;
	static measuring_canvas;
	static initialized = false;
	element;
	width;
	centered;
	constructor(text, x, y, x_centered) {
		this.element = document.createElement(`randoKEKWsTringnubmer${JSTextBox.n_elements}asd`);
		JSTextBox.n_elements++;
		this.element.innerHTML = text;
		document.body.appendChild(this.element);
		if (!JSTextBox.initialized) {
			document.addEventListener("click", JSTextBox.ClickEventHandler);
			JSTextBox.measuring_canvas = document.createElement('canvas');
			JSTextBox.initialized = true;
		}
		let context = JSTextBox.measuring_canvas.getContext("2d");
		context.font = this.element.style.fontSize + " " + this.element.style.fontFamily;
		this.width = context.measureText(this.element.innerHTML).width;
		this.centered = x_centered;
		if (this.centered)
			x -= this.width / 2;
		this.element.style = `position: absolute; left: ${x}px; top: ${y}px; color: #FFFFFF`;
		this.element.style.fontSize = "40px";
		this.element.style.fontFamily = "courier";
	}
	Move(x, y) {
		if (this.centered)
			x -= this.width / 2
		this.element.style = `position: absolute; left: ${x}px; top: ${y}px; color: #FFFFFF`;
		this.element.style.fontSize = "40px";
		this.element.style.fontFamily = "courier";
	}
	ChangeText(text) {
		this.element.innerHTML = text;
		let context = JSTextBox.measuring_canvas.getContext("2d");
		context.font = this.element.style.fontSize + " " + this.element.style.fontFamily;
		this.width = context.measureText(this.element.innerHTML).width;
	}
}

class JSButton {
	static n_elements = 0;
	element_num;
	static measuring_canvas;
	static xl = [];
	static xh = [];
	static yl = [];
	static yh = [];
	static func = [];
	static func_param = [];
	static event_added = false;
	static ClickEventHandler(event) {
		let xcoord = event.clientX;
		let ycoord = event.clientY;
		for (var i = 0; i < JSButton.n_elements; i++) {
			if (JSButton.xl[i] < xcoord && xcoord < JSButton.xh[i] && JSButton.yl[i] < ycoord && ycoord < JSButton.yh[i]) {
				JSButton.func[i](JSButton.func_param[i]);
			}
		}
	}
	centered;
	background_img;
	element;
	constructor(text, image_src, x, y, _centered, callback, cb_param) {
		this.element = document.createElement(`randoKASDASDEKWsTringnubmer${JSButton.n_elements}asd`);
		this.element_num = JSButton.n_elements;
		JSButton.n_elements++;
		this.element.style = `position: absolute; left: ${x}px; top: ${y}px; color: #FFFFFF`;
		this.element.style.fontSize = "40px";
		this.element.style.fontFamily = "courier";
		this.element.innerHTML = text;
		if (!JSButton.event_added) {
			document.addEventListener("click", JSButton.ClickEventHandler);
			JSButton.measuring_canvas = document.createElement('canvas');
			JSButton.event_added = true;
		}
		let context = JSButton.measuring_canvas.getContext("2d");
		context.font = this.element.style.fontSize + " " + this.element.style.fontFamily;
		let width = context.measureText(this.element.innerHTML).width;
		let height = 45;
		console.log(width);
		JSButton.xl.push(x);
		JSButton.xh.push(x + width);
		JSButton.yl.push(y);
		JSButton.yh.push(y + height);
		JSButton.func_param.push(cb_param);
		JSButton.func.push(callback);
		this.background_img = new JSImage(image_src, x, y);
		this.background_img.AbsoluteSize(width, height);
		document.body.appendChild(this.element);
		this.centered = _centered;
		if (this.centered)
			this.Move(x - width / 2, y - height / 2);
	}

	Move(x, y) {
		let w = JSButton.xh[this.element_num] - JSButton.xl[this.element_num];
		let h = JSButton.yh[this.element_num] - JSButton.yl[this.element_num];
		if (this.centered) {
			x -= w / 2;
			y -= h / 2;
		}
		this.element.style = `position: absolute; left: ${x}px; top: ${y}px; color: #FFFFFF`;
		this.element.style.fontSize = "40px";
		this.element.style.fontFamily = "courier";
		JSButton.xl[this.element_num] = x;
		JSButton.xh[this.element_num] = x + w;
		JSButton.yl[this.element_num] = y;
		JSButton.yh[this.element_num] = y + h;
		this.background_img.Move(x, y);
	}

	ChangeText(text) {
		this.element.innerHTML = text;
		let context = JSButton.measuring_canvas.getContext("2d");
		context.font = this.element.style.fontSize + " " + this.element.style.fontFamily;
		let width = context.measureText(this.element.innerHTML).width;
		let ave_x = (JSButton.xh[this.element_num] - JSButton.xl[this.element_num]) / 2;
		JSButton.xl[this.element_num] = ave_x - width / 2;
		JSButton.xh[this.element_num] = ave_x + width / 2;
	}
}
