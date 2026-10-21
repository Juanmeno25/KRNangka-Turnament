const router = require('express').Router();
const { auth, adminOnly } = require('../middleware/auth');
const A = require('../controllers/authController');
const T = require('../controllers/tournamentController');
const R = require('../controllers/registrationController');
const AD = require('../controllers/adminController');

const w = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const admin = [auth, adminOnly];

router.post('/auth/login', w(A.login));
router.post('/auth/logout', A.logout);
router.get('/auth/me', auth, A.me);

router.get('/tournaments', w(T.list));
router.get('/tournaments/:id', w(T.get));
router.post('/tournaments', admin, w(T.create));
router.put('/tournaments/:id', admin, w(T.update));
router.delete('/tournaments/:id', admin, w(T.remove));

router.get('/tournaments/:id/registrations', admin, w(R.listByTournament));
router.post('/tournaments/:id/registrations', w(R.create)); // publik, tanpa login

router.get('/admin/stats', admin, w(T.stats));
router.get('/admins', admin, w(AD.list));
router.post('/admins', admin, w(AD.create));
router.put('/admins/:id/password', admin, w(AD.setPassword));
router.delete('/admins/:id', admin, w(AD.remove));
router.get('/registrations', admin, w(R.listAll));
router.put('/registrations/:id', admin, w(R.update));
router.delete('/registrations/:id', admin, w(R.remove));

module.exports = router;
