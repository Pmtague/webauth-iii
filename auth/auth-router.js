const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model.js');
const secrets = require('../config/secrets.js');

// For endpoints beginning with /api/auth
router.post('/register', (req, res) => {
	let user = req.body;
	const hash = bcrypt.hashSync(user.password, 10);
	user.password = hash;

	Users.add(user)
		.then(saved => {
			res.status(201).json(saved);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Could not register user' });
		});
});

router.post('/login', (req, res) => {
	let { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
				const token = generateToken(user);
				res.status(200).json({ message: `Welcome ${ user.username }!`,
				token,
		 		});
			} else {
				res.status(401).json({ message: 'Invalid credentials' });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Unable to login' });
		});
});

router.get('/logout', (req, res) => {
	console.log(req.token)
	if (req.token) {
		req.token.destroy(err => {
			if (err) {
				res.send('Error logging out')
			} else {
				res.send('Goodbye')
			}
		});
	} else {
		res.status(500).json({ message: 'Ooopsie, poopsie!' })
	}
});

function generateToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
		department: user.department,
	}
	const options = {
		expiresIn: '8h',
	}
	return jwt.sign(payload, secrets.jwtSecret, options)
};

module.exports = router;