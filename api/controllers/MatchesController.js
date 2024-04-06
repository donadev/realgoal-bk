/**
 * MatchesController
 *
 * @description :: Server-side logic for managing matches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	list: function(req, res) {
		var scraper = new ListScraper();
		scraper.scrape(function(error, matches) {
            if(error) return res.serverError({error: error});
            return res.ok(matches);
        });
	},
	detail: function(req, res) {
		var id = req.param("id");
		var scraper = new DetailScraper(id);
		scraper.scrape(function(error, match) {
			if(error) return res.serverError({error: error});
			return res.ok(match);
		})
	}
};
