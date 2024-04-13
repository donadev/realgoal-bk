var cheerio = require("cheerio");

module.exports = function(match) {
    this.match = match;
    var self = this;
    $ = null;
    this.scrape = function(cb) {
        var self = this;
        PageLoader.obtainPage(sails.config.connections.baseAPIUrl + "partita/" + this.match + "/#informazioni-partita")
            .then((url) => self.parseMatchInfos(url, ".smv__homeParticipant"))
            .then(function(match) {
                cb(null, match);
            }).catch(cb);
    };

    this.parseEvent = function(item) {
        var event = {};

        event.time = $(item).find(".smv__timeBox").text();
        event.team = $(item).hasClass("smv__homeParticipant") ? "home" : "away";
        event.participant = $(item).find(".smv__playerName").text();
        event.assist = $(item).find(".smv__assist").find("a").text();
        var icon = $(item).find(".smv__incident svg");
        if(icon.hasClass("yellowCard-ico")) event.name = "yellow_card";
        else if(icon.hasClass("redCard-ico")) event.name = "red_card";
        else if(icon.attr("data-testid") == "wcl-icon-soccer") event.name = "goal"; 
        else if(icon.hasClass("substitution")) {
            event.name = "substitution";
            event.substitution_in = $(item).find(".smv__playerName").text(); 
            event.substitution_out = $(item).find(".smv__subDown").text(); 
        }
        else if(icon.hasClass("soccer-ball-own")) { //TODO
            event.name = "autogol";
            event.team = event.team == "home" ? "away" : "home";
        }
        return event;
    };

    this.parseMatch = function() {
        var match = {};
        match.home = {
            icon: $(".duelParticipant__home").find("img").attr("src"),
            name: $(".duelParticipant__home").find(".participant__participantName a").text().trim(),
            score: $(".detailScore__wrapper").find("span").eq(0).text().trim()
        };
        match.away = {
            icon: $(".duelParticipant__away").find("img").attr("src"),
            name: $(".duelParticipant__away").find(".participant__participantName a").text().trim(),
            score: $(".detailScore__wrapper").find("span").eq(2).text().trim()
        };
        match.date = $(".duelParticipant__startTime").text();
        match.events = [];

        $(".smv__verticalSections").find(".smv__participantRow").each(function(i, elem) {
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
