
function onCreated() {
	if (browser.runtime.lastError) {
		console.log("Error: ${browser.runtime.lastError}");
	} else {
		console.log("Item created successfully");
	}
}

class BaseRemover{
	constructor() {	    
	}

	needRemove(tab) {
		return false;
	}
}

function moveThroughTabs(remover){
	console.log("Tabsscanner active"); 
	var alltabs=	browser.tabs.query({currentWindow: true}) ;
	alltabs.then((tabs) => {
		var tabIdsToRemove = [];
		for (let tab of tabs) {			
			if(tab.status == "complete" && remover.needRemove(tab) ) {
				tabIdsToRemove.push(tab.id);
			} 
		}	
		if(tabIdsToRemove.length > 0){
			browser.tabs.remove(
					tabIdsToRemove          // integer or integer array
			);
		}
	});
}
function isBlank(str) {
	return (!str || /^\s*$/.test(str));
}


var functionMap = new Map();

function callFunction(tab,id){
	console.log("To Call: " + id);
	if(functionMap.has(id)){
		var toCall=	functionMap.get(id);
		toCall(tab);
	}
}

function registerFunction(id,toCall){
	functionMap.set(id, toCall);
}
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

registerFunction("mi_dupplicated", removeDupplicated);/**
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
registerFunction("mi_by-sameHost", removeBySameHost);/**
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
registerFunction("mi_by-source", removeBySource);/**
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
/**
 * Handling des Klicks auf ein Menüpunkt
 */

browser.menus.onClicked.addListener((info, tab) => {
	callFunction(tab,info.menuItemId);
});



//