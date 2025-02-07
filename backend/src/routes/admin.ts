import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import User from '../models/User';
import Creator from '../models/Creator';
import Content from '../models/Content';
import Subscription from '../models/Subscription';
import Report from '../models/Report';

const router = express.Router();

// Middleware para verificar se é admin
const adminAuth = [auth, checkRole(['admin'])];

// Dashboard Stats
router.get('/dashboard-stats', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalCreators,
      totalContent,
      totalRevenue,
      pendingReports,
      recentSignups
    ] = await Promise.all([
      User.countDocuments(),
      Creator.countDocuments(),
      Content.countDocuments(),
      Subscription.aggregate([
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]),
      Report.countDocuments({ status: 'pending' }),
      User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('name email role createdAt')
    ]);

    res.json({
      totalUsers,
      totalCreators,
      totalContent,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingReports,
      recentSignups
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User Management
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Content Moderation
router.get('/content', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const query = status ? { status } : {};

    const [content, total] = await Promise.all([
      Content.find(query)
        .populate('creatorId', 'name email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Content.countDocuments(query)
    ]);

    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reports Management
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const query = status ? { status } : {};

    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate('contentId')
        .populate('reporterId', 'name email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Report.countDocuments(query)
    ]);

    res.json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Financial Reports
router.get('/financial', adminAuth, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30days';
    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const [revenue, subscriptions, topCreators] = await Promise.all([
      Subscription.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            total: { $sum: '$price' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Subscription.countDocuments({
        createdAt: { $gte: startDate }
      }),
      Creator.aggregate([
        {
          $lookup: {
            from: 'subscriptions',
            localField: '_id',
            foreignField: 'creatorId',
            as: 'subscriptions'
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            totalEarnings: { $sum: '$subscriptions.price' },
            subscriberCount: { $size: '$subscriptions' }
          }
        },
        { $sort: { totalEarnings: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      revenue,
      subscriptions,
      topCreators
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// System Settings
router.get('/settings', adminAuth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/settings', adminAuth, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 