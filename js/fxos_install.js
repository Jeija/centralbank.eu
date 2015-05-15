var manifestURL = "http://192.168.0.100:8080/fxos/package.manifest";

$(function () {
	$("#fxos_install").click(function () {
		if (!navigator.mozApps) {
			alert("Dein Browser unsertützt die Installation von Firefox-Apps nicht! Probiere es mit einem aktuellen Firefox.");
			return;
		}
		var req = navigator.mozApps.installPackage(manifestURL);
 		req.onsuccess = function() {
			console.log("onsuccess", this);
			alert("App erfolgreich installiert! Du findest sie jetzt auf deinem Homescreen / in deinem Anwendungsmenü.");
		};
		req.onerror = function() {
			console.log("onerror", this);
			alert("Fehler bei der App-Installation (" + this.error.name + ")");
		};
	});
});
