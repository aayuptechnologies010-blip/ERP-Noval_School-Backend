const express = require('express');
const router = express.Router();
const extraCtrl = require('../controllers/websiteExtraController');
const {
  getWebAdminDashboardStats,
  getAlbums,
  createAlbum,
  deleteAlbum,
  getVideos,
  createVideo,
  deleteVideo,
  getNotices,
  createNotice,
  deleteNotice,
  getAchievements,
  createAchievement,
  deleteAchievement,
  getMedia,
  createMedia,
  deleteMedia,
  getKidsAlbums,
  createKidsAlbum,
  deleteKidsAlbum,
  getEvents,
  createEvent,
  deleteEvent,
  getSports,
  createSport,
  deleteSport,
  getBlogs,
  createBlog,
  deleteBlog,
  getGuestbook,
  createGuestbook,
  deleteGuestbook,
  // LFD
  getLfdAlbumConfig,
  saveLfdAlbumConfig,
  uploadPhotoToAlbum,
  getLfdFlyers,
  createLfdFlyer,
  deleteLfdFlyer,
  getLfdNotices,
  createLfdNotice,
  deleteLfdNotice,
  getLfdToppers,
  createLfdTopper,
  deleteLfdTopper
} = require('../controllers/webAdminController');

// Dashboard statistics
router.get('/dashboard-stats', getWebAdminDashboardStats);

// 10 Resource Endpoints
router.get('/albums', getAlbums);
router.post('/albums', createAlbum);
router.delete('/albums/:id', deleteAlbum);

router.get('/videos', getVideos);
router.post('/videos', createVideo);
router.delete('/videos/:id', deleteVideo);

router.get('/notices', getNotices);
router.post('/notices', createNotice);
router.delete('/notices/:id', deleteNotice);

router.get('/achievements', getAchievements);
router.post('/achievements', createAchievement);
router.delete('/achievements/:id', deleteAchievement);

router.get('/media', getMedia);
router.post('/media', createMedia);
router.delete('/media/:id', deleteMedia);

router.get('/kids-albums', getKidsAlbums);
router.post('/kids-albums', createKidsAlbum);
router.delete('/kids-albums/:id', deleteKidsAlbum);

router.get('/events', getEvents);
router.post('/events', createEvent);
router.delete('/events/:id', deleteEvent);

router.get('/sports', getSports);
router.post('/sports', createSport);
router.delete('/sports/:id', deleteSport);

router.get('/blogs', getBlogs);
router.post('/blogs', createBlog);
router.delete('/blogs/:id', deleteBlog);

router.get('/guestbook', getGuestbook);
router.post('/guestbook', createGuestbook);
router.delete('/guestbook/:id', deleteGuestbook);

// LFD Endpoints
router.get('/lfd/album-config', getLfdAlbumConfig);
router.post('/lfd/album-config', saveLfdAlbumConfig);
router.post('/lfd/album-photo', uploadPhotoToAlbum);

router.get('/lfd/flyers', getLfdFlyers);
router.post('/lfd/flyers', createLfdFlyer);
router.delete('/lfd/flyers/:id', deleteLfdFlyer);

router.get('/lfd/notices', getLfdNotices);
router.post('/lfd/notices', createLfdNotice);
router.delete('/lfd/notices/:id', deleteLfdNotice);

router.get('/lfd/toppers', getLfdToppers);
router.post('/lfd/toppers', createLfdTopper);
router.delete('/lfd/toppers/:id', deleteLfdTopper);

// Extra Website Modules Endpoints
router.get('/magazine', extraCtrl.magazineController.getAll);
router.post('/magazine', extraCtrl.magazineController.create);
router.put('/magazine/:id', extraCtrl.magazineController.update);
router.delete('/magazine/:id', extraCtrl.magazineController.delete);

router.get('/slider', extraCtrl.homepageSliderController.getAll);
router.post('/slider', extraCtrl.homepageSliderController.create);
router.put('/slider/:id', extraCtrl.homepageSliderController.update);
router.delete('/slider/:id', extraCtrl.homepageSliderController.delete);

router.get('/career', extraCtrl.careerController.getAll);
router.post('/career', extraCtrl.careerController.create);
router.put('/career/:id', extraCtrl.careerController.update);
router.delete('/career/:id', extraCtrl.careerController.delete);

router.get('/upload-tc', extraCtrl.uploadTcController.getAll);
router.post('/upload-tc', extraCtrl.uploadTcController.create);
router.put('/upload-tc/:id', extraCtrl.uploadTcController.update);
router.delete('/upload-tc/:id', extraCtrl.uploadTcController.delete);

router.get('/holiday-homework', extraCtrl.holidayHomeworkController.getAll);
router.post('/holiday-homework', extraCtrl.holidayHomeworkController.create);
router.put('/holiday-homework/:id', extraCtrl.holidayHomeworkController.update);
router.delete('/holiday-homework/:id', extraCtrl.holidayHomeworkController.delete);

router.get('/website-toppers', extraCtrl.websiteTopperController.getAll);
router.post('/website-toppers', extraCtrl.websiteTopperController.create);
router.put('/website-toppers/:id', extraCtrl.websiteTopperController.update);
router.delete('/website-toppers/:id', extraCtrl.websiteTopperController.delete);

router.get('/photos-homepage', extraCtrl.photosHomepageController.getAll);
router.post('/photos-homepage', extraCtrl.photosHomepageController.create);
router.put('/photos-homepage/:id', extraCtrl.photosHomepageController.update);
router.delete('/photos-homepage/:id', extraCtrl.photosHomepageController.delete);

router.get('/website-thoughts', extraCtrl.websiteThoughtController.getAll);
router.post('/website-thoughts', extraCtrl.websiteThoughtController.create);
router.put('/website-thoughts/:id', extraCtrl.websiteThoughtController.update);
router.delete('/website-thoughts/:id', extraCtrl.websiteThoughtController.delete);

router.get('/mandatory-disclosure', extraCtrl.mandatoryDisclosureController.getAll);
router.post('/mandatory-disclosure', extraCtrl.mandatoryDisclosureController.saveOrUpdate);
router.put('/mandatory-disclosure/:id', extraCtrl.mandatoryDisclosureController.update);
router.delete('/mandatory-disclosure/:id', extraCtrl.mandatoryDisclosureController.delete);

router.get('/staff-visibility', extraCtrl.staffVisibilityController.getAll);
router.post('/staff-visibility', extraCtrl.staffVisibilityController.saveOrUpdate);
router.put('/staff-visibility/:id', extraCtrl.staffVisibilityController.update);
router.delete('/staff-visibility/:id', extraCtrl.staffVisibilityController.delete);

router.get('/e-bulletin', extraCtrl.eBulletinController.getAll);
router.post('/e-bulletin', extraCtrl.eBulletinController.create);
router.put('/e-bulletin/:id', extraCtrl.eBulletinController.update);
router.delete('/e-bulletin/:id', extraCtrl.eBulletinController.delete);

// e-Diaries Endpoints
router.get('/e-diaries', extraCtrl.eDiaryController.getAll);
router.post('/e-diaries', extraCtrl.eDiaryController.create);
router.put('/e-diaries/:id', extraCtrl.eDiaryController.update);
router.delete('/e-diaries/:id', extraCtrl.eDiaryController.delete);

// Feedback Endpoints
router.get('/feedback/subject-class', extraCtrl.feedbackSubjectClassController.getAll);
router.post('/feedback/subject-class', extraCtrl.feedbackSubjectClassController.create);
router.put('/feedback/subject-class/:id', extraCtrl.feedbackSubjectClassController.update);
router.delete('/feedback/subject-class/:id', extraCtrl.feedbackSubjectClassController.delete);

router.get('/feedback/subject-teacher', extraCtrl.feedbackSubjectTeacherController.getAll);
router.post('/feedback/subject-teacher', extraCtrl.feedbackSubjectTeacherController.create);
router.put('/feedback/subject-teacher/:id', extraCtrl.feedbackSubjectTeacherController.update);
router.delete('/feedback/subject-teacher/:id', extraCtrl.feedbackSubjectTeacherController.delete);

router.get('/feedback/questions', extraCtrl.feedbackQuestionController.getAll);
router.post('/feedback/questions', extraCtrl.feedbackQuestionController.create);
router.put('/feedback/questions/:id', extraCtrl.feedbackQuestionController.update);
router.delete('/feedback/questions/:id', extraCtrl.feedbackQuestionController.delete);

router.get('/feedback/templates', extraCtrl.feedbackTemplateController.getAll);
router.post('/feedback/templates', extraCtrl.feedbackTemplateController.create);
router.put('/feedback/templates/:id', extraCtrl.feedbackTemplateController.update);
router.delete('/feedback/templates/:id', extraCtrl.feedbackTemplateController.delete);

module.exports = router;
