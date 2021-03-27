const { Router } = require("express");
const config = require("../config/default.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();

router.post(
	"/register",
	[
		check("email", "Invalid email").normalizeEmail().isEmail(),
		check("password", "Invalid password").isLength({ min: 6 }),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: "Invalid registration data",
				});
			}

			const { email, password } = req.body;
			const candidate = await User.findOne({ email });

			if (candidate) {
				return res.status(400).json({ message: "Email already use" });
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const user = new User({ email, password: hashedPassword });
			await user.save();
			res.status(201).json({ message: "User created" });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Server error" });
		}
	}
);

router.post(
	"/login",
	[
		check("email", "Invalid email").normalizeEmail().isEmail(),
		check("password", "Invalid password").exists(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: "Invalid login data",
				});
			}

			const { email, password } = req.body;
			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ message: "User not found" });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: "Invalid password" });
			}

			const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
				expiresIn: "1h",
			});

			res.json({ token, userId: user.id });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Server error" });
		}
	}
);

module.exports = router;
