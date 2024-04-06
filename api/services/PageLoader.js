var phantom = require("phantom");
 module.exports = {

     obtainPage: function(url) {
         return new Promise(function(resolve, reject) {
             var instance, page;
             phantom.create()
                    .then(function(_instance) {
                        instance = _instance;
                        return instance.createPage();
                    })
                    .then(function(_page) {
                        page = _page;
                        return page.open(url, {encoding: "utf8"});
                    }).then(function(status) {
                        if(status != "success") return reject();
                        var body = page.property("content");
                        page.close();
                        instance.exit();
                        return resolve(body);
                    });
         });
     }
 };
