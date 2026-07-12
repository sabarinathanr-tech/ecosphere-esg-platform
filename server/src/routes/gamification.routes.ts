import { Router } from 'express';
import {
  getChallenges, getChallengeById, createChallenge, updateChallenge, deleteChallenge,
  getChallengeParticipations, getChallengeParticipationById, createChallengeParticipation, updateChallengeParticipation, deleteChallengeParticipation,
  getBadges, getBadgeById, createBadge, updateBadge, deleteBadge, awardBadge,
  getRewards, getRewardById, createReward, updateReward, deleteReward,
  getRedemptions, getRedemptionById, createRedemption, updateRedemption, deleteRedemption,
  getLeaderboard,
} from '../controllers/gamification.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  createChallengeSchema, updateChallengeSchema,
  createChallengeParticipationSchema, updateChallengeParticipationSchema,
  createBadgeSchema, updateBadgeSchema,
  createRewardSchema, updateRewardSchema,
  createRedemptionSchema, updateRedemptionSchema,
} from '../schemas';

const router = Router();
router.use(authenticate);

// Challenges
router.get('/challenges', getChallenges);
router.get('/challenges/:id', getChallengeById);
router.post('/challenges', authorize('ADMIN', 'MANAGER'), validateBody(createChallengeSchema), createChallenge);
router.post('/challenges/:id/join', createChallengeParticipation);
router.put('/challenges/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateChallengeSchema), updateChallenge);
router.delete('/challenges/:id', authorize('ADMIN'), deleteChallenge);

// Challenge Participation
router.get('/challenge-participation', getChallengeParticipations);
router.get('/challenge-participation/:id', getChallengeParticipationById);
router.post('/challenge-participation', validateBody(createChallengeParticipationSchema), createChallengeParticipation);
router.put('/challenge-participation/:id', validateBody(updateChallengeParticipationSchema), updateChallengeParticipation);
router.delete('/challenge-participation/:id', authorize('ADMIN'), deleteChallengeParticipation);

// Badges
router.get('/badges', getBadges);
router.get('/badges/:id', getBadgeById);
router.post('/badges', authorize('ADMIN'), validateBody(createBadgeSchema), createBadge);
router.post('/badges/:id/award', authorize('ADMIN', 'MANAGER'), awardBadge);
router.put('/badges/:id', authorize('ADMIN'), validateBody(updateBadgeSchema), updateBadge);
router.delete('/badges/:id', authorize('ADMIN'), deleteBadge);

// Rewards
router.get('/rewards', getRewards);
router.get('/rewards/:id', getRewardById);
router.post('/rewards', authorize('ADMIN'), validateBody(createRewardSchema), createReward);
router.put('/rewards/:id', authorize('ADMIN'), validateBody(updateRewardSchema), updateReward);
router.delete('/rewards/:id', authorize('ADMIN'), deleteReward);

// Reward Redemptions
router.get('/reward-redemptions', getRedemptions);
router.get('/reward-redemptions/:id', getRedemptionById);
router.post('/reward-redemptions', validateBody(createRedemptionSchema), createRedemption);
router.put('/reward-redemptions/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateRedemptionSchema), updateRedemption);
router.delete('/reward-redemptions/:id', authorize('ADMIN'), deleteRedemption);

// Leaderboard
router.get('/leaderboard', getLeaderboard);

export default router;
