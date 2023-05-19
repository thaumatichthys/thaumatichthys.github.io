
const input_title = document.getElementById("page-title").innerHTML;
const input_content = document.getElementById("page-content").innerHTML;

const string_template = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title>thaumatichthys</title>
	<link rel="icon" type="image/x-icon" href="res/wavelet.png">
	<link href="style.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<script src="script.js"></script>

	<div class="page">
		<div class="header">
			<h1 class="header-text">
				Thaumatichthys Projects
			</h1>
			<table class="navbar-top"> <!-- I think the table looks better than an unordered list -->
				<tr>
					<td>
						<h3><a href="./index.html">About</a></h3>
					</td>
					<td>
						<h3><a href="./electronics.html">Electronics</a></h3>
					</td>
                    <td>
						<h3><a href="./programming.html">Programming</a></h3>
					</td>
                    <td>
						<h3><a href="./contact.html">Contact</a></h3>
					</td>
					<td>
						<h3><a href="./disclaimer.html">Disclaimer</a></h3>
					</td>
				</tr>
			</table>
		</div>

		<div class="margin-extern">
			<div class="margin-intern">
				<div class="content-main">
					<h2 class="content-title" id="page-title">
						CONTENT TITLE!!!!!!!!!!!!!!!!!!!!!!!!!
					</h2>
					<p class="content-text" id="page-text">
						CONTENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					</p>
				</div>
			</div>
		</div>

		<div class="footer">
			<!-- <h3>footer</h3> -->
			<p>Thaumatichthys Pagidostomus</p>
			<h4 class="navbar-bottom"><a href="./disclaimer.html">Disclaimer</a></h4>
		</div>
	</div>
</body>
</html>`;

const parser = new DOMParser();
var page_template = parser.parseFromString(string_template, 'text/html');

page_template.getElementById("page-title").innerHTML = input_title;
page_template.getElementById("page-text").innerHTML = input_content;

console.log(page_template.documentElement.innerHTML)

document.open();
document.write(page_template.documentElement.innerHTML);
document.close();

console.log("dodne")