
/**
 * Doppelte Tabs entfernen
 */
class RemoverDuplicateUrls extends BaseRemover{

	constructor() {	
		super();
		this.urlsActive = [];
	}

	needRemove(tab) {
		var tabUrl = tab.url; 
		if( this.urlsActive.indexOf(tabUrl) > -1 ) {
			console.log("Dupplicated: " + tabUrl);
			return true;
		} else {
			this.urlsActive.push(tabUrl);   
		}	
		return false;
	}
};


function removeDupplicated(tab) {
	
	var rem = new RemoverDuplicateUrls();
	moveThroughTabs(rem);
}


browser.menus.create({
	id : "mi_dupplicated",
	title : browser.i18n.getMessage("MI_DUPPLICATED"),
	contexts : [ "tab" ]
}, onCreated);

registerFunction("mi_dupplicated", removeDupplicated);

