
const input_title = document.getElementById("page-title").innerHTML;
const input_content = document.getElementById("page-content").innerHTML;

const string_template = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title>Thaumatichthys</title>
	<link rel="icon" type="image/x-icon" href="/res/wavelet.png">
	<link href="/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<div class="page">
		<div class="header">
			<h1 class="header-text">
				<a href="/index.html">Thaumatichthys Projects</a>
			</h1>
			<div class="navbar-top"> <!-- I think the table looks better than an unordered list -->
				<div class="navbar-top-cell">
					<h3><a href="/mainpage/electronics/">Electronics</a></h3>
				</div>
				<div class="navbar-top-cell">
					<h3><a href="/mainpage/programming/">Programming</a></h3>
				</div>
				<div class="navbar-top-cell">
					<h3><a href="/mainpage/misc/">Misc</a></h3>
				</div>
				<div class="navbar-top-cell">
					<h3><a href="/mainpage/contact/">Contact</a></h3>
				</div>
				<div class="navbar-top-cell">
					<h3><a href="/mainpage/disclaimer/">Disclaimer</a></h3>
				</div>
			</div>
		</div>

		<div class="margin-extern">
			<div class="margin-intern">
				<div class="content-main">
					<h2 class="content-title" id="page-title">
						CONTENT TITLE
					</h2>
					<p class="content-text" id="page-text">
						CONTENT
					</p>
				</div>
			</div>
		</div>

		<div class="footer">
			<!-- <h3>footer</h3> -->
			<p>Thaumatichthys Pagidostomus</p>
			<h4 class="navbar-bottom"><a href="/mainpage/disclaimer/">Disclaimer</a></h4>
		</div>
	</div>
</body>
</html>`;

function UpdatePage() {
	const parser = new DOMParser();
	const page_template = parser.parseFromString(string_template, 'text/html');

	page_template.getElementById("page-title").innerHTML = input_title;
	page_template.getElementById("page-text").innerHTML = input_content;

	const codeBoxes = page_template.getElementsByClassName("codebox");

	const n_codeboxes = codeBoxes.length;

	for (var i = 0; i < n_codeboxes; i++) {
		codeBoxes[0].className = "codeBoxInst";
	}
	console.log(codeBoxes.length)

	document.open();
	document.documentElement.innerHTML = page_template.documentElement.innerHTML;
	//document.write(page_template.documentElement.innerHTML);
	document.close();

	console.log("Page loaded through JS")
}

function SetUpCodeBoxes() {
	var collection = document.getElementsByClassName("codeBoxInst");
	const length = collection.length;
	var newDivs = new Array(length);
	var buttonElements = new Array(length);
	var contents = new Array(length);
	var fillers = new Array(length);
	var previousTimeoutID;

	const hiddenButtonText = "(Expand)";
	const shownButtonText = "(Hide)";
	const transitionTime = 320;

	for (var i = 0; i < collection.length; i++) {
		newDivs[i] = document.createElement('div');

		newDivs[i].appendChild(collection[i].cloneNode(true));
		collection[i].parentNode.replaceChild(newDivs[i], collection[i]);
		newDivs[i].className = "codeBoxContent";
		buttonElements[i] = document.createElement("div");
		buttonElements[i].innerHTML = hiddenButtonText;
		buttonElements[i].className = "codeBoxButton";
		collection[i].style.transition = `opacity ${transitionTime / 1000}s ease-in-out`;

		newDivs[i].prepend(buttonElements[i]);
		contents[i] = buttonElements[i].nextElementSibling;
		(function(i) {
			buttonElements[i].addEventListener("click", function() {
				console.log(i);
				if (contents[i].style.opacity == 0) {
					contents[i].style.height = "auto";
					newDivs[i].style.height = "auto";
					contents[i].style.opacity = 1;
					buttonElements[i].innerHTML = shownButtonText;
					contents[i].style.pointerEvents = "auto";
					clearTimeout(previousTimeoutID);
				} 
				else {
					contents[i].style.opacity = 0;
					previousTimeoutID = setTimeout(function() {
						contents[i].style.height = 0;
						newDivs[i].style.height = "44px";
					}, 
					transitionTime);
					contents[i].style.pointerEvents = "none";
					buttonElements[i].innerHTML = hiddenButtonText;
				}
			});
		})(i);
		console.log(i);
		contents[i].style.opacity = 0;
		contents[i].style.height = 0;
		newDivs[i].style.height = "44px";
	}
}

UpdatePage();
SetUpCodeBoxes();
