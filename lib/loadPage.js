const Keys = require('../keys')

const loadPages = function(pageJson,opts){
  let pages = pageJson;
  if(typeof pages == "string"){
    pages = JSON.parse(pages);
  }
  for(index in pages){
    let page = pages[index];
    let finalPage = new Array(15);
    for(key in page){
      let type = page[key]
      let params = [];
      params.push(null);//Need null for first param in bind.apply for syntax reasons
      if(page[key] && typeof page[key] != "string"){
        type = page[key].type;
        for(opt in page[key].params){
          if(opts[page[key].params[opt]]){
            params.push(opts[page[key].params[opt]]);
          }else{
            params.push(page[key].params[opt]);
          }
        }
      }
      if(Keys[type]){
        finalPage[key] = new (Function.prototype.bind.apply(Keys[type],params))
      }
    }
    pages[index] = finalPage;
  }
  return pages;
}

module.exports = loadPages
