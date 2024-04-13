var cheerio = require("cheerio");

module.exports = function() {
    var self = this;
    $ = null;
    this.scrape = function(cb) {
        var self = this;
        PageLoader.obtainPage(sails.config.connections.baseAPIUrl, ".event__match")
            .then(self.parseMatches)
            .then(function(matches) {
                cb(null, matches);
            }).catch(cb);
    };

    this.parseMatch = function(item) {
        var output = {
            id: $(item).attr("id").substring(4),
            hour: $(item).find(".event__time").text(),
            team_home: $(item).find(".event__participant--home").text(),
            team_away: $(item).find(".event__participant--away").text(),
            score_home: $(item).find(".event__score--home").text(),
            score_away: $(item).find(".event__score--away").text(),
            timer: $(item).find(".event__stage--block").text(),
            state: "finished"
        };
        if ($(item).hasClass("event__match--scheduled")) output.state = "scheduled";
        if ($(item).hasClass("event__match--live")) output.state = "live";
        return output;
    };
    this.parseChamp = function(item) {
        var championship = {
            country: $(item).find(".event__titleBox > .wclLeagueHeader__overline").text(),
            tournament: $(item).find(".event__titleBox > a").text(),
            matches: []
        };
        return championship;
    };
    this.isChamp = function(item) {
        return $(item).hasClass("wclLeagueHeader")
    }
    this.isMatch = function(item) {
        return $(item).hasClass("event__match")
    }
    this.parseMatches = function(content) {
        return new Promise(function(resolve, reject) {
            if(content == null) return resolve(null)
            $ = cheerio.load(content);
            if($ == null) return reject("diretta.it has bad page syntax");
            console.log("Parsing content")
            var championships = [];
            $("body").find(".sportName.soccer div").each(function(i, item) {
                if (self.isChamp(item)) {
                    const championship = self.parseChamp(item);
                    championships.push(championship);
                } else if (self.isMatch(item)) {
                    const match = self.parseMatch(item)
                    championships[championships.length - 1].matches.push(match)
                }
            });
            return resolve(championships);
        });
    };

};
