module.exports = function(req, res, next) {
  var id = req.param("id");
  if(_.isUndefined(id) || _.isEmpty(id)) return res.badRequest({error: "No id received"});

  next();

};
