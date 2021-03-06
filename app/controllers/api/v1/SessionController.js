import passport from "passport"
import jwt from "jsonwebtoken"
import _ from "lodash"

import { load as configLoader } from "../../../../config/config"
import { UserSerializer } from "../../../models"


let config = configLoader()

export default class SessionController {
  static create(req, res) {
    passport.authenticate('local', function(err, user, msg) {
      if (err) {
        return res.status(401).jsonp({ err: err.message })
      }

      if (user === false) {
        if (!msg) {
          msg = 'Internal server error'
        }

        return res.status(401).jsonp({ err: msg })
      }

      var secret = config.secret
      var authToken = jwt.sign({ userId: user.id }, secret)

      new UserSerializer(user).toJSON(function(err, json) {
        return res.jsonp(_.extend(json, { authToken: authToken }))
      })
    })(req, res)
  }
}
