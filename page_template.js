/*
 * 	hi
 * 	these are the terrible internals of the site
 */
const input_title = document.getElementById("page-title").innerHTML;
const input_content = document.getElementById("page-content").innerHTML;
const string_template = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title id="page-tab-title">Thaumatichthys</title>
	<link rel="icon" type="image/x-icon" href="/res/circle2.png">
	<link href="/style.css" rel="stylesheet" type="text/css" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Corinthia:wght@400;700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

</head>
<body>
	<div class="page">
		<div class="header">
			<h1 class="header-text">
				<a href="/index.html">Thaumatichthys Projects</a>
			</h1>
			<div class="navbar-top"> <!-- I think the table looks better than an unordered list -->
				<div class="navbar-top-cell">
					<p><a href="/mainpage/electronics/">Electronics</a></p>
				</div>
				<div class="navbar-top-cell">
					<p><a href="/mainpage/programming/">Programming</a></p>
				</div>
				<div class="navbar-top-cell">
					<p><a href="/mainpage/misc/">Misc</a></p>
				</div>
				<div class="navbar-top-cell">
					<p><a href="/mainpage/about/">About</a></p>
				</div>
				<div class="navbar-top-cell">
					<p><a href="/mainpage/disclaimer/">Disclaimer</a></p>
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
			<p>Thaumatichthys Pagidostomus (Max Xiang)</p>
			<h4 class="navbar-bottom"><a href="/mainpage/disclaimer/">Disclaimer</a></h4>
		</div>
	</div>
</body>
</html>`;

function UpdatePage() {
	const parser = new DOMParser();
	const page_template = parser.parseFromString(string_template, 'text/html');

	page_template.getElementById("page-title").innerHTML = input_title;
	page_template.getElementById("page-tab-title").innerHTML = input_title;
	page_template.getElementById("page-text").innerHTML = input_content;

	const codeBoxes = page_template.getElementsByClassName("codebox");

	const n_codeboxes = codeBoxes.length;

	for (var i = 0; i < n_codeboxes; i++) {
		codeBoxes[0].className = "codeBoxInst";
	}
	console.log(codeBoxes.length)

	const imgBoxes = page_template.getElementsByClassName("imgbox");

	const n_imgboxes = imgBoxes.length;

	for (var i = 0; i < n_imgboxes; i++) {
		imgBoxes[0].className = "imgBoxInst";
	}
	console.log(imgBoxes.length)


	document.open();
	document.documentElement.innerHTML = page_template.documentElement.innerHTML;
	document.close();
	console.log("Page loaded through JS")

	if (page_template.getElementsByClassName("includeMathJax").length != 0) {
		var mj = document.createElement('script');
		mj.src = "/mathjax-es5/tex-chtml.js";
		document.head.appendChild(mj);
		console.log("Using MathJax");
	}
}

function SetUpCodeBoxes() {
	var collection = document.getElementsByClassName("codeBoxInst");
	const length = collection.length;
	var newDivs = new Array(length);
	var buttonElements = new Array(length);
	var contents = new Array(length);
	var previousTimeoutID;
	const hiddenButtonText = "(Expand Code)";
	const shownButtonText = "(Hide Code)";
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

function SetUpImgBoxes() {
	var collection = document.getElementsByClassName("imgBoxInst");
	const length = collection.length;
	var newDivs = new Array(length);
	var buttonElements = new Array(length);
	var contents = new Array(length);
	var previousTimeoutID;
	const hiddenButtonText = "(Expand Images)";
	const shownButtonText = "(Hide Images)";
	const transitionTime = 320;
	for (var i = 0; i < collection.length; i++) {
		newDivs[i] = document.createElement('div');

		newDivs[i].appendChild(collection[i].cloneNode(true));
		collection[i].parentNode.replaceChild(newDivs[i], collection[i]);
		newDivs[i].className = "imgBoxContent";
		buttonElements[i] = document.createElement("div");
		buttonElements[i].innerHTML = hiddenButtonText;
		buttonElements[i].className = "imgBoxButton";
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
SetUpImgBoxes();

var script = document.createElement('script');
script.src = "https://www.googletagmanager.com/gtag/js?id=G-F13RJTEZ4T";
script.async = true;
script.onload = function() {
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', 'G-F13RJTEZ4T');
};
document.head.appendChild(script);

