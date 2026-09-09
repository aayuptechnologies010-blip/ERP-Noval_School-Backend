const Album = require('../models/albumModel');
const Video = require('../models/videoModel');
const Notice = require('../models/noticeModel');
const Media = require('../models/mediaModel');
const Achievement = require('../models/achievementModel');
const Event = require('../models/eventModel');
const Sport = require('../models/sportModel');
const Blog = require('../models/blogModel');
const Guestbook = require('../models/guestbookModel');
const { LfdAlbumConfig, LfdFlyer, LfdNotice, LfdTopper } = require('../models/lfdModel');

// @desc    Get Web Admin Dashboard Stats
// @route   GET /api/web-admin/dashboard-stats
const getWebAdminDashboardStats = async (req, res) => {
  try {
    const [
      photoAlbums,
      videoAlbums,
      notices,
      achievements,
      mediaAlbums,
      events,
      sports,
      blogs,
      guestbook
    ] = await Promise.all([
      Album.countDocuments({}),
      Video.countDocuments({}),
      Notice.countDocuments({}),
      Achievement.countDocuments({}),
      Media.countDocuments({}),
      Event.countDocuments({}),
      Sport.countDocuments({}),
      Blog.countDocuments({}),
      Guestbook.countDocuments({})
    ]);

    const kidsAlbums = await Album.countDocuments({ category: { $regex: /kid/i } }).catch(() => 0);

    res.status(200).json({
      success: true,
      data: {
        photoAlbums: photoAlbums || 0,
        videoAlbums: videoAlbums || 0,
        notices: notices || 0,
        achievements: achievements || 0,
        mediaAlbums: mediaAlbums || 0,
        kidsAlbums: kidsAlbums || 0,
        events: events || 0,
        sports: sports || 0,
        blogs: blogs || 0,
        guestbook: guestbook || 0
      }
    });
  } catch (error) {
    console.error('Error in getWebAdminDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Web Admin Dashboard statistics',
      error: error.message
    });
  }
};

// 1. Photo Albums
const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: albums.length, data: albums });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createAlbum = async (req, res) => {
  try {
    const { title, category, eventDate, description, coverImage, status, totalMemories } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Album Title is required' });
    }
    const newAlbum = new Album({
      title,
      category: category || 'General',
      eventDate: eventDate ? new Date(eventDate) : new Date(),
      description: description || '',
      coverImage: coverImage || '',
      totalMemories: totalMemories || 1,
      isActive: status !== undefined ? (status === 'Active' || status === true) : true
    });
    await newAlbum.save();
    res.status(201).json({ success: true, message: 'Photo album created successfully', data: newAlbum });
  } catch (err) {
    console.error('Error creating photo album:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Album.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Photo album not found' });
    }
    res.status(200).json({ success: true, message: 'Photo album deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Video Albums
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createVideo = async (req, res) => {
  try {
    const { title, category, eventDate, description, status, coverImage, videoUrl } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Album Title is required' });
    }
    let thumb = coverImage || '';
    if (!thumb && videoUrl) {
      const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        thumb = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      }
    }
    const newVideo = new Video({
      title,
      category: category || 'General',
      eventDate: eventDate ? new Date(eventDate) : new Date(),
      description: description || '',
      status: status || 'Active',
      coverImage: thumb,
      thumbnail: thumb,
      videoUrl: videoUrl || ''
    });
    await newVideo.save();
    res.status(201).json({ success: true, message: 'Video album created successfully', data: newVideo });
  } catch (err) {
    console.error('Error creating video album:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Video album not found' });
    }
    res.status(200).json({ success: true, message: 'Video album deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createNotice = async (req, res) => {
  try {
    const { title, heading, category, noticeDate, activationDate, deactivationDate, attachment, coverImage, showOnWebsite, description, status } = req.body;
    const newNotice = new Notice({
      title: title || heading || 'School Notice',
      heading: heading || title || 'School Notice',
      category: category || 'General',
      noticeDate: noticeDate ? new Date(noticeDate) : new Date(),
      activationDate: activationDate ? new Date(activationDate) : new Date(),
      deactivationDate: deactivationDate ? new Date(deactivationDate) : null,
      attachment: attachment || '',
      coverImage: coverImage || '',
      showOnWebsite: showOnWebsite !== undefined ? showOnWebsite : true,
      description: description || '',
      isActive: status !== undefined ? (status === 'Active' || status === true) : true
    });
    await newNotice.save();
    res.status(201).json({ success: true, message: 'Notice created successfully', data: newNotice });
  } catch (err) {
    console.error('Error creating notice:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notice.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Achievements
const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: achievements.length, data: achievements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createAchievement = async (req, res) => {
  try {
    const { title, studentName, category, venue, eventDate, date, rank, description, photoUrl, status, showOn } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Achievement title is required' });
    const newAch = new Achievement({
      title,
      studentName: studentName || '',
      category: category || 'General',
      venue: venue || '',
      eventName: venue || title,
      date: eventDate || date || new Date().toISOString().split('T')[0],
      rank: rank || '1st',
      description: description || '',
      photoUrl: photoUrl || '',
      showOn: showOn || 'Website',
      status: status || 'Active'
    });
    await newAch.save();
    res.status(201).json({ success: true, message: 'Achievement created successfully', data: newAch });
  } catch (err) {
    console.error('Error creating achievement:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Achievement.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Achievement not found' });
    res.status(200).json({ success: true, message: 'Achievement deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Media
const getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: media.length, data: media });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createMedia = async (req, res) => {
  try {
    const { mediaName, headline, title, publishDate, mediaSource, type, fileUrl, thumbnail, description, status } = req.body;
    const newMedia = new Media({
      title: headline || title || mediaName || 'Media Item',
      headline: headline || title || '',
      mediaName: mediaName || '',
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      mediaSource: mediaSource || 'url',
      type: type || (mediaSource === 'pdf' ? 'document' : (mediaSource === 'image' ? 'image' : 'video')),
      fileUrl: fileUrl || '',
      thumbnail: thumbnail || fileUrl || '',
      description: description || '',
      isActive: status !== undefined ? (status === 'Active' || status === true) : true
    });
    await newMedia.save();
    res.status(201).json({ success: true, message: 'Media album created successfully', data: newMedia });
  } catch (err) {
    console.error('Error creating media:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Media.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Media not found' });
    res.status(200).json({ success: true, message: 'Media deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 6. Kids Albums
const getKidsAlbums = async (req, res) => {
  try {
    let kids = await Album.find({ category: { $regex: /kid/i } }).sort({ createdAt: -1 });
    if (kids.length === 0) {
      kids = await Album.find({ title: { $regex: /kid|primary|kinder/i } }).sort({ createdAt: -1 });
    }
    res.status(200).json({ success: true, count: kids.length, data: kids });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createKidsAlbum = async (req, res) => {
  try {
    const { title, category, eventDate, description, coverImage, status } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    const newKid = new Album({
      title,
      category: category || 'Kids Corner',
      eventDate: eventDate ? new Date(eventDate) : new Date(),
      description: description || '',
      coverImage: coverImage || '',
      totalMemories: 1,
      isActive: status !== undefined ? (status === 'Active' || status === true) : true
    });
    await newKid.save();
    res.status(201).json({ success: true, message: 'Kids album created successfully', data: newKid });
  } catch (err) {
    console.error('Error creating kids album:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteKidsAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Album.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Kids album not found' });
    res.status(200).json({ success: true, message: 'Kids album deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 7. Events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, eventDate, time, location, category, description, bannerUrl, coverImage, photos, status } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Event title is required' });
    const newEvent = new Event({
      title,
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      time: time || '10:00 AM',
      location: location || 'School Campus',
      category: category || 'Cultural',
      description: description || '',
      bannerUrl: bannerUrl || coverImage || '',
      coverImage: coverImage || bannerUrl || '',
      photos: photos || (coverImage ? [coverImage] : []),
      status: status || 'Upcoming'
    });
    await newEvent.save();
    res.status(201).json({ success: true, message: 'Event created successfully', data: newEvent });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 8. Sports
const getSports = async (req, res) => {
  try {
    const sports = await Sport.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: sports.length, data: sports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createSport = async (req, res) => {
  try {
    const { title, sportType, matchDate, teams, result, description, photoUrl, status } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Sport title is required' });
    const newSport = new Sport({
      title,
      sportType: sportType || 'Athletics',
      matchDate: matchDate || new Date().toISOString().split('T')[0],
      teams: teams || '',
      result: result || '',
      description: description || '',
      photoUrl: photoUrl || '',
      status: status || 'Active'
    });
    await newSport.save();
    res.status(201).json({ success: true, message: 'Sport record created successfully', data: newSport });
  } catch (err) {
    console.error('Error creating sport:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteSport = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Sport.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Sport record not found' });
    res.status(200).json({ success: true, message: 'Sport record deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 9. Blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, author, category, content, description, coverImage, status } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Blog title is required' });
    const newBlog = new Blog({
      title,
      author: author || 'School Editorial Board',
      category: category || 'General',
      content: content || description || 'Blog post content',
      coverImage: coverImage || '',
      status: status || 'Published',
      publishedAt: new Date()
    });
    await newBlog.save();
    res.status(201).json({ success: true, message: 'Blog post created successfully', data: newBlog });
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 10. Guestbook
const getGuestbook = async (req, res) => {
  try {
    const comments = await Guestbook.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createGuestbook = async (req, res) => {
  try {
    const { name, email, phone, message, rating, status, photoUrl } = req.body;
    if (!name || !message) return res.status(400).json({ success: false, message: 'Name and message are required' });
    const newGuest = new Guestbook({
      name,
      email: email || '',
      phone: phone || '',
      message,
      rating: rating || 5,
      photoUrl: photoUrl || '',
      status: status || 'Approved'
    });
    await newGuest.save();
    res.status(201).json({ success: true, message: 'Guestbook entry created successfully', data: newGuest });
  } catch (err) {
    console.error('Error creating guestbook entry:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteGuestbook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Guestbook.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Guestbook entry not found' });
    res.status(200).json({ success: true, message: 'Guestbook entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 11. LFD (Large Format Display) CONTROLLERS
// ==========================================

// LFD Album Configuration
const getLfdAlbumConfig = async (req, res) => {
  try {
    let config = await LfdAlbumConfig.findOne().populate('albumId');
    const allAlbums = await Album.find().sort({ createdAt: -1 });

    if (!config && allAlbums.length > 0) {
      const latest = allAlbums[0];
      const photos = [latest.coverImage, ...(latest.photos || [])].filter(Boolean);
      config = new LfdAlbumConfig({
        method: 'latest',
        albumId: latest._id,
        albumTitle: latest.title,
        selectedPhotos: photos,
        slideDuration: 5,
        transitionEffect: 'Fade',
        showTitle: true
      });
      await config.save();
    }

    res.status(200).json({
      success: true,
      config: config || null,
      albums: allAlbums
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const saveLfdAlbumConfig = async (req, res) => {
  try {
    const { method, albumId, albumTitle, selectedPhotos, slideDuration, transitionEffect, showTitle } = req.body;
    let config = await LfdAlbumConfig.findOne();
    if (config) {
      if (method) config.method = method;
      if (albumId) config.albumId = albumId;
      if (albumTitle) config.albumTitle = albumTitle;
      if (selectedPhotos) config.selectedPhotos = selectedPhotos;
      if (slideDuration) config.slideDuration = slideDuration;
      if (transitionEffect) config.transitionEffect = transitionEffect;
      if (showTitle !== undefined) config.showTitle = showTitle;
      await config.save();
    } else {
      config = new LfdAlbumConfig({
        method: method || 'latest',
        albumId,
        albumTitle: albumTitle || '',
        selectedPhotos: selectedPhotos || [],
        slideDuration: slideDuration || 5,
        transitionEffect: transitionEffect || 'Fade',
        showTitle: showTitle !== undefined ? showTitle : true
      });
      await config.save();
    }
    res.status(200).json({ success: true, message: 'LFD Album configuration saved successfully', data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const uploadPhotoToAlbum = async (req, res) => {
  try {
    const { albumId, photoUrl } = req.body;
    if (!albumId || !photoUrl) {
      return res.status(400).json({ success: false, message: 'Album ID and Photo are required' });
    }
    const album = await Album.findById(albumId);
    if (!album) return res.status(404).json({ success: false, message: 'Album not found' });
    if (!album.photos) album.photos = [];
    album.photos.push(photoUrl);
    album.totalMemories = (album.photos ? album.photos.length : 0) + (album.coverImage ? 1 : 0);
    await album.save();
    res.status(200).json({ success: true, message: 'Photo uploaded to album successfully', data: album });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LFD Flyers
const getLfdFlyers = async (req, res) => {
  try {
    const flyers = await LfdFlyer.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: flyers.length, data: flyers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createLfdFlyer = async (req, res) => {
  try {
    const { flyerName, activationDate, deactivationDate, displayOrder, flyerImage, status } = req.body;
    if (!flyerName) return res.status(400).json({ success: false, message: 'Flyer name is required' });
    const flyer = new LfdFlyer({
      flyerName,
      activationDate: activationDate || new Date(),
      deactivationDate: deactivationDate || null,
      displayOrder: Number(displayOrder) || 1,
      flyerImage: flyerImage || '',
      status: status || 'Active'
    });
    await flyer.save();
    res.status(201).json({ success: true, message: 'LFD Flyer created successfully', data: flyer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteLfdFlyer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LfdFlyer.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Flyer not found' });
    res.status(200).json({ success: true, message: 'LFD Flyer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LFD Notices
const getLfdNotices = async (req, res) => {
  try {
    const notices = await LfdNotice.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createLfdNotice = async (req, res) => {
  try {
    const { noticeHeading, noticeDate, description, status, showOnFooter, displayOrder } = req.body;
    if (!noticeHeading) return res.status(400).json({ success: false, message: 'Notice heading is required' });
    const notice = new LfdNotice({
      noticeHeading,
      noticeDate: noticeDate || new Date(),
      description: description || '',
      status: status || 'Active',
      showOnFooter: showOnFooter || false,
      displayOrder: Number(displayOrder) || 1
    });
    await notice.save();
    res.status(201).json({ success: true, message: 'LFD Notice created successfully', data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteLfdNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LfdNotice.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.status(200).json({ success: true, message: 'LFD Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LFD Toppers
const getLfdToppers = async (req, res) => {
  try {
    const toppers = await LfdTopper.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: toppers.length, data: toppers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createLfdTopper = async (req, res) => {
  try {
    const { academicYear, studentClass, studentName, displayOrder, description, photoUrl, status } = req.body;
    if (!studentName) return res.status(400).json({ success: false, message: 'Student name is required' });
    const topper = new LfdTopper({
      academicYear: academicYear || '2026-2027',
      studentClass: studentClass || 'Class X',
      studentName,
      displayOrder: Number(displayOrder) || 1,
      description: description || '',
      photoUrl: photoUrl || '',
      status: status || 'Active'
    });
    await topper.save();
    res.status(201).json({ success: true, message: 'LFD Topper created successfully', data: topper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteLfdTopper = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LfdTopper.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Topper not found' });
    res.status(200).json({ success: true, message: 'LFD Topper deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
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
};
