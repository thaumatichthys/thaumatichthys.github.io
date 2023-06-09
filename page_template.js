
const input_title = document.getElementById("page-title").innerHTML;
const input_content = document.getElementById("page-content").innerHTML;

const string_template = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title>thaumatichthys</title>
	<link rel="icon" type="image/x-icon" href="/res/wavelet.png">
	<link href="/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<script src="script.js"></script>

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

const parser = new DOMParser();
const page_template = parser.parseFromString(string_template, 'text/html');

page_template.getElementById("page-title").innerHTML = input_title;
page_template.getElementById("page-text").innerHTML = input_content;

document.open();
document.write(page_template.documentElement.innerHTML);
document.close();

console.log("Page loaded through JS")