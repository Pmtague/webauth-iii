const router = require('express').Router();

const Users = require('../users/users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, (req, res) => {
	// let loggedInDept = Users.findDepartment(req.user.username);
	Users.find()
		.then(users => {
			let deptUsers = users.map(user => user.department = payload.department)
			console.log(user)
			res.status(200).json({ deptUsers, loggedInUser: req.user.username });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Could not retrieve users' })
		});
});

module.exports = router;