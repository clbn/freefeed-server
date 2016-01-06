import { TimelineSerializer, User } from '../../../models'
import exceptions from '../../../support/exceptions'


export default class TimelineController {
  static async home(req, res) {
    if (!req.user) {
      res.status(401).jsonp({ err: 'Not found', status: 'fail'})
      return
    }

    try {
      var user = req.user

      let timeline = await user.getRiverOfNewsTimeline({
        offset: req.query.offset,
        limit: req.query.limit,
        currentUser: user.id
      })

      let json = await new TimelineSerializer(timeline).promiseToJSON()
      res.jsonp(json)
    } catch (e) {
      exceptions.reportError(res)(e)
    }
  };

  static async directs(req, res) {
    var user = req.user

    user.getDirectsTimeline({
      offset: req.query.offset,
      limit: req.query.limit,
      currentUser: req.user ? req.user.id : null
    })
      .then(function(timeline) {
        new TimelineSerializer(timeline).toJSON(function(err, json) {
          res.jsonp(json)
        })
      })
      .catch(function(e) { exceptions.reportError(res)(e) })
  };

  static async posts(req, res) {
    try {
      var username = req.params.username

      var user = await User.findByUsername(username)
      var currentUser = req.user ? req.user.id : null
      var timeline = await user.getPostsTimeline({
        offset: req.query.offset,
        limit: req.query.limit,
        currentUser: currentUser
      })

      let json = await new TimelineSerializer(timeline).promiseToJSON();
      res.jsonp(json);
    } catch(e) {
      exceptions.reportError(res)(e)
    }
  };

  static async likes(req, res) {
    try {
      var username = req.params.username

      var user = await User.findByUsername(username)
      var currentUser = req.user ? req.user.id : null
      var timeline = await user.getLikesTimeline({
        offset: req.query.offset,
        limit: req.query.limit,
        currentUser: currentUser
      })

      new TimelineSerializer(timeline).toJSON(function(err, json) {
        res.jsonp(json)
      })
    } catch(e) {
      exceptions.reportError(res)(e)
    }
  };

  static async comments(req, res) {
    try {
      var username = req.params.username

      var user = await User.findByUsername(username)
      var currentUser = req.user ? req.user.id : null
      var timeline = await user.getCommentsTimeline({
        offset: req.query.offset,
        limit: req.query.limit,
        currentUser: currentUser
      })

      new TimelineSerializer(timeline).toJSON(function(err, json) {
        res.jsonp(json)
      })
    } catch(e) {
      exceptions.reportError(res)(e)
    }
  };

  static async myDiscussions (req, res) {
    if (!req.user) {
      res.status(401).jsonp({ err: 'Not found', status: 'fail'})
      return
    }

    var user = req.user

    try {
      let timeline = await user.getMyDiscussionsTimeline({
        offset: req.query.offset,
        limit: req.query.limit,
        currentUser: req.user ? req.user.id : null
      })

      let json = await new TimelineSerializer(timeline).promiseToJSON()
      res.jsonp(json)
    } catch (e) {
      exceptions.reportError(res)(e)
    }
  };
}
