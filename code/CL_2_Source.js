/**
 * Tabs anhand des HTMl Quelltextes schließen
 * 
 */

function removeBySource(tab) {
	browser.tabs.executeScript({code: "prompt('HTML?')"}, function(result) {
		console.log("Source: " + result);
		if(!isBlank(result)){

			moveThroughTabsSource(result);
		}
	})
}

function moveThroughTabsSource(sourceCode){
	console.log("Tabsscanner active"); 
	var alltabs=	browser.tabs.query({currentWindow: true}) ;
	alltabs.then((tabs) => {

		for (let tab of tabs) {			
			if(tab.status == "complete" ) {

				browser.tabs.sendMessage( tab.id, {"req":"html"}).then(response => {
					if(response.content.includes(sourceCode)){
						browser.tabs.remove(tab.id);
					}
				});
			} 
		}	
	});
}

browser.menus.create({
	id : "mi_by-source",
	title : browser.i18n.getMessage("MI_SOURCE"),
	contexts : [ "tab" ]
}, onCreated);
registerFunction("mi_by-source", removeBySource);