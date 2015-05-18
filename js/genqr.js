$(function () {

/**
 * Taken from http://stackoverflow.com/questions/21060876/is-there-any-way-to-center-text-with-jspdf,
 * user Tsilis
 **/
(function(API) {
	API.centerText = function(txt, x, y) {
		var lines = txt.split("\n");
		var longest = lines[0];
		lines.forEach(function (l) { if (l.length > longest.length) longest = l; })
		var fontSize = this.internal.getFontSize();
		var pageWidth = this.internal.pageSize.width;
		txtWidth = this.getStringUnitWidth(longest) * fontSize / this.internal.scaleFactor;
		x = ( pageWidth - txtWidth ) / 2;
		this.text(txt, x, y);
	}
})(jsPDF.API);

$("#generate").click(function () {
	var doc = new jsPDF("landscape");

	/** Heading **/
	doc.setFont("helvetica");
	doc.setFontSize(40);
	doc.setFontType("bold");
	doc.centerText($("#pageheading").val(), 149, 20);

	/** QR-Code **/
	var code = qr.image($("#qrid").val());
	doc.addImage(code, "PNG", 90, 30, 140, 140);

	/** QR-ID **/
	doc.setFont("helvetica");
	doc.setFontSize(20);
	doc.setFontType("normal");
	doc.centerText($("#qrid").val(), 149, 158);

	/** Description **/
	doc.setFont("helvetica");
	doc.setFontSize(20);
	doc.setFontType("italic");
	doc.centerText($("#text").val(), 149, 170);

	doc.save("qrcode_centralbank.pdf");
});


});
