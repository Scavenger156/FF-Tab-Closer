
/**
 * Basiscode
 */

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

