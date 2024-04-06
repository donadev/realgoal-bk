var cheerio = require("cheerio");

module.exports = function(match) {
    this.match = match;
    var self = this;
    $ = null;
    this.scrape = function(cb) {
        var self = this;
        PageLoader.obtainPage(sails.config.connections.baseAPIUrl + "partita/" + this.match + "/#informazioni-partita")
            .then(self.parseMatchInfos)
            .then(function(match) {
                cb(null, match);
            }).catch(cb);
    };

    this.parseEvent = function(item) {
        var event = {};

        event.time = $(item).find(".time-box, .time-box-wide").text();
        event.team = $(item).find(".fl").find(".wrapper").text().trim() ? "home" : "away";
        event.participant = $(item).find(".participant-name").find("a").text();
        event.assist = $(item).find(".assist").find("a").text();
        var icon = $(item).find(".icon-box");
        if(icon.hasClass("y-card")) event.name = "yellow_card";
        else if(icon.hasClass("r-card")) event.name = "red_card";
        else if(icon.hasClass("soccer-ball")) event.name = "goal";
        else if(icon.hasClass("substitution-in")) {
            event.name = "substitution";
            event.substitution_in = $(item).find(".substitution-in-name").find("a").text();
            event.substitution_out = $(item).find(".substitution-out-name").find("a").text();
        }
        else if(icon.hasClass("soccer-ball-own")) {
            event.name = "autogol";
            event.team = event.team == "home" ? "away" : "home";
        }
        return event;
    };

    this.parseMatch = function() {
        var match = {};

        match.home = {
            icon: sails.config.connections.baseAPIUrl + $(".tlogo-home").find("img").attr("src"),
            name: $(".tname-home").find("span").text().trim(),
            score: $(".current-result").find(".scoreboard").eq(0).text().trim()
        };
        match.away = {
            icon: sails.config.connections.baseAPIUrl + $(".tlogo-away").find("img").attr("src"),
            name: $(".tname-away").find("span").text().trim(),
            score: $(".current-result").find(".scoreboard").eq(1).text().trim()
        };
        match.date = $("#utime").text();
        match.events = [];

        $(".parts-first").find(".odd, .even").each(function(i, elem) {
            var matchEvent = self.parseEvent(elem);
            match.events.push(matchEvent);
        });
        return match;
    };
    this.parseMatchInfos = function(content) {
        return new Promise(function(resolve, reject) {
            $ = cheerio.load(content);
            if($ == null) return reject("diretta.it has bad page syntax");
            var match = self.parseMatch();
            return resolve(match);
        });
    };
}
