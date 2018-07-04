
/**
 * Tabs mit dem Selben Server wie dem Selektierten Tab schließen
 */
var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    var hostname = l.hostname;
    l.remove();
    return hostname;
}; 

class RemoveSameHost extends BaseRemover {
	constructor(tab) {	
		super();
		this.tabIdNotToClose = tab.id;
		this.host = getLocation(tab.url.toString().toLowerCase());
		
	}
	needRemove(tab) {
		var tabUrl = getLocation(tab.url.toString().toLowerCase()); 
		if( tabUrl == this.host && this.tabIdNotToClose != tab.id) {
			console.log("Dupplicated: " + tabUrl);
			return true;
		} 
		return false;
	} 
} 

function removeBySameHost(tab) {
	 var rem = new RemoveSameHost(tab);
	 moveThroughTabs(rem);
}

browser.menus.create({
	id : "mi_by-sameHost",
	title : browser.i18n.getMessage("MI_HOST"),
	contexts : [ "tab" ]
}, onCreated);
registerFunction("mi_by-sameHost", removeBySameHost);

