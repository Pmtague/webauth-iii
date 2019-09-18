const router = require('express').Router();

const Users = require('../users/users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, (req, res) => {
	Users.find()
		.then(users => {
			res.status(200).json({ users, loggedInUser: req.user.username });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Could not retrieve users' })
		});
});

module.exports = router;