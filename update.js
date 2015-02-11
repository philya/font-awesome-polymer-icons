/* Updates fa-icons.html with latest font awesome icons */

var // Node Modules
	extend = require("extend"),
	fs = require("fs"),
	Handlebars = require("handlebars"),
	request = require("request"),
	yaml = require("js-yaml");

var // Request options (proxy?)
	requestOptions = {
		proxy: ""
	},
	// Raw repo url
	rawRepo = "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/",
	// Request urls
	urls = {
		yml: rawRepo + "src/icons.yml",
		svg: rawRepo + "src/assets/font-awesome/fonts/fontawesome-webfont.svg"
	},
	// Output SVG object
	svg = {
		begin: "<!doctype html>\n" +
			"<!--\n" +
			"Polymer icon set generated from Font Awesome SVG Font\n" +
			"using Font Awesome Polymer Icons Generator\n" +
			"https://github.com/philya/font-awesome-polymer-icons-generator\n" +
			"-->\n" +
			"<link rel=\"import\" href=\"../core-icon/core-icon.html\">\n" +
			"<link rel=\"import\" href=\"../core-iconset-svg/core-iconset-svg.html\">\n" +
			"<core-iconset-svg id=\"fa\" iconSize=\"1792\">\n" +
			"<svg><defs>\n",
		defs: "",
		end: "</defs></svg></core-iconset-svg>"
	},
	// Icon template
	template = Handlebars.compile(
		"<g id=\"{{name}}\" transform=\"translate({{shiftX}} {{shiftY}})\">" +
		"<g transform=\"scale(1 -1) translate(0 -1280)\">" +
		"<path d=\"{{path}}\"/>" +
		"</g></g>\n"),
	// Icons object
	icons = {},
	// Pixel base size
	pixelBase = 128,
	// Generate icon and addit to output svg
	generateIcon = function (name, svgPath, params) {
		"use strict";
		svg.defs += template(extend({
			name: name,
			path: svgPath
		}, params, {
			shiftX: -(-(14 * pixelBase - params.advWidth) / 2),
			shiftY: -(-2 * pixelBase),
			width: 14 * pixelBase,
			height: 14 * pixelBase
		}));
	};

console.log("Request YML ...");
request(extend(true, requestOptions, {
	url: urls.yml
}), function (ymlError, ymlResponse, iconsYaml) {
	"use strict";
	console.log("Request SVG ...");
	request(extend(true, requestOptions, {
		url: urls.svg
	}), function (svgError, svgResponse, fontData) {
		var yamlIcons = yaml.safeLoad(iconsYaml).icons,
			lines = fontData.toString("utf8").split("\n");
		yamlIcons.forEach(function (icon) {
			icons[icon.unicode] = icon.id;
		});
		console.log("Parsing icons ...");
		lines.forEach(function (line) {
			var match = line.match(
					/^<glyph unicode="&#x([^"]+);"\s*(?:horiz-adv-x="(\d+)")?\s*d="([^"]+)"/
				),
				str;
			if (match) {
				str = match[1];
				if (icons[str]) {
					generateIcon(icons[str], match[3], {
						advWidth: match[2] ? match[2] : 1536
					});
				}
			}
		});
		console.log("Writing icons to file ...");
		fs.writeFileSync("fa-icons.html", svg.begin + svg.defs + svg.end);
	});
});
