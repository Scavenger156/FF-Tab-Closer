
/**
 * Tabs mit einem Titel den der Benutzer eingibt schließen
 * 
 */
class RemoveByTitle extends BaseRemover {
	constructor(name) {	
		super();
		this.title = name.toString().toLowerCase();
	}
	needRemove(tab) {
		var tabUrl = tab.title.toString().toLowerCase(); 
		if( tabUrl.includes(this.title) ) {
			console.log("Dupplicated: " + tabUrl);
			return true;
		} 
		return false;
	}
}

function removeByTitle(tab) {
	browser.tabs.executeScript({code: "prompt('Title?')"}, function(result) {
		console.log("Title: " + result);
		 if(!isBlank(result)){
		 var rem = new RemoveByTitle(result);
		 moveThroughTabs(rem);
		}
	})	
}


browser.menus.create({
	id : "mi_by-title",
	title : browser.i18n.getMessage("MI_TITLE"),
	contexts : [ "tab" ]
}, onCreated);

registerFunction("mi_by-title", removeByTitle);

