
/**
 * Handling des Klicks auf ein Menüpunkt
 */

browser.menus.onClicked.addListener((info, tab) => {
	callFunction(tab,info.menuItemId);
});



//