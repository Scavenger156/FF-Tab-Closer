/**
 * Callback um den HTMl Quelltext zu erhalten. Param: "html"
 */
browser.runtime.onMessage.addListener(request => {
  var response = "";
  if(request.req == "html") {
    response = document.documentElement.innerHTML;
  }
 
  return Promise.resolve({content: response});
});