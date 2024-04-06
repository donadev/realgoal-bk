var cheerio = require("cheerio");

module.exports = function() {
    var self = this;
    $ = null;
    this.scrape = function(cb) {
        var self = this;
        PageLoader.obtainPage(sails.config.connections.baseAPIUrl)
            .then(self.parseMatches)
            .then(function(matches) {
                cb(null, matches);
            }).catch(cb);
    };

    this.parseMatch = function(item) {
        var output = {
            id: $(item).attr("id").substring(4),
            hour: $(item).find(".time").remove("span").text(),
            team_home: $(item).find(".team-home").find("span").remove("span").text(),
            team_away: $(item).find(".team-away").find("span").remove("span").text(),
            score: $(item).find(".score").remove("span").text(),
            timer: $(item).find(".timer").find("span").remove("span").text()
        };
        if ($(item).hasClass("stage-scheduled")) output.state = "scheduled";
        if ($(item).hasClass("stage-live")) output.state = "live";
        if ($(item).hasClass("stage-finished")) output.state = "finished";
        return output;
    };
    this.parseChamp = function(item) {
        var championship = {
            country: $(item).find(".country_part").remove("span").text().slice(0, -2),
            tournament: $(item).find(".tournament_part").remove("span").text(),
            matches: []
        };
        $(item).find("tbody tr").each(function(i, elem) {
            var match = self.parseMatch(elem);
            championship.matches.push(match);
        });
        return championship;
    };
    this.parseMatches = function(content) {
        return new Promise(function(resolve, reject) {
            $ = cheerio.load(content);
            if($ == null) return reject("diretta.it has bad page syntax");
            var championships = [];
            $("body").find("table").each(function(i, item) {
                var championship = self.parseChamp(item);
                championships.push(championship);
            });
            return resolve(championships);
        });
    };

};
