const schools = require('../data/orgs.json')
const users = require('../data/users.json')
module.exports = router => {

  router.get('/account/sign-in', (req, res) => {
    var options = users.map(user => {
      return {
        text: user.emailAddress,
        value: user.emailAddress,
        hint: {
          text: user.profile.status ? 'Profile: ' + user.profile.status : ''
        }
      }
    })
    res.render('account/sign-in', {
      returnUrl: req.query.returnUrl,
      options
    })
  })

  router.get('/account/sign-in-as-profile', (req, res) => {
    res.render('account/sign-in-as-profile', {
      users
    })
  })

  router.post('/account/sign-in', (req, res) => {
    if(req.body.emailAddress) {
      res.locals.user = req.session.user = users.find(user => user.emailAddress == req.body.emailAddress)
    } else {
      res.locals.user = req.session.user = users[0]
    }

    if(req.body.returnUrl) {
      res.redirect(req.body.returnUrl)
    } else {

      if(req.session.user.profile.previousApplication == 'Yes'){
        res.redirect('/account/new/confirmation')
      }else{
        res.redirect('/jobs')
      }
    }
  })

  router.get('/account/sign-out', (req, res) => {
    res.locals.user = req.session.user = null
    res.redirect('/')
  })

  router.post('/account/new', (req, res) => {
    res.locals.user = req.session.user = {
      emailAddress: req.body.emailAddress,
      password: req.body.password,
      profile: {
        locations: {},
        qualifications: {},
        workHistory: {},
        hiddenPlaces: {}
      }
    }
    res.redirect('/account/new/confirmation')
  })

  router.get('/account/new/confirmation', (req, res) => {

    res.render('account/new/confirmation', {
      user: req.session.user
    })
  })

}
