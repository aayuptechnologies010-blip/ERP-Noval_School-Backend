const {
  Magazine,
  HomepageSlider,
  Career,
  UploadTC,
  HolidayHomework,
  WebsiteTopper,
  PhotosHomepage,
  WebsiteThought,
  MandatoryDisclosure,
  StaffVisibility,
  EBulletin,
  EDiary,
  FeedbackSubjectClass,
  FeedbackSubjectTeacher,
  FeedbackQuestion,
  FeedbackTemplate
} = require("../models/websiteExtraModel");

// Factory function to create basic CRUD operations for a given model
const createController = (Model) => {
  return {
    getAll: async (req, res) => {
      try {
        const data = await Model.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(`Error fetching ${Model.modelName}:`, error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
      }
    },
    create: async (req, res) => {
      try {
        const newData = new Model(req.body);
        await newData.save();
        res.status(201).json({ success: true, message: `${Model.modelName} created successfully`, data: newData });
      } catch (error) {
        console.error(`Error creating ${Model.modelName}:`, error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
      }
    },
    update: async (req, res) => {
      try {
        const { id } = req.params;
        const updated = await Model.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
          return res.status(404).json({ success: false, message: "Record not found" });
        }
        res.status(200).json({ success: true, message: `${Model.modelName} updated successfully`, data: updated });
      } catch (error) {
        console.error(`Error updating ${Model.modelName}:`, error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
      }
    },
    delete: async (req, res) => {
      try {
        const { id } = req.params;
        const deletedData = await Model.findByIdAndDelete(id);
        if (!deletedData) {
          return res.status(404).json({ success: false, message: "Record not found" });
        }
        res.status(200).json({ success: true, message: `${Model.modelName} deleted successfully` });
      } catch (error) {
        console.error(`Error deleting ${Model.modelName}:`, error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
      }
    }
  };
};

module.exports = {
  magazineController: createController(Magazine),
  homepageSliderController: createController(HomepageSlider),
  careerController: createController(Career),
  uploadTcController: createController(UploadTC),
  holidayHomeworkController: createController(HolidayHomework),
  websiteTopperController: createController(WebsiteTopper),
  photosHomepageController: createController(PhotosHomepage),
  websiteThoughtController: createController(WebsiteThought),
  mandatoryDisclosureController: {
    ...createController(MandatoryDisclosure),
    saveOrUpdate: async (req, res) => {
      try {
        let doc = await MandatoryDisclosure.findOne().sort({ createdAt: -1 });
        if (doc) {
          doc = await MandatoryDisclosure.findByIdAndUpdate(doc._id, req.body, { new: true });
        } else {
          doc = new MandatoryDisclosure(req.body);
          await doc.save();
        }
        res.status(200).json({ success: true, message: "Mandatory Disclosure saved successfully", data: doc });
      } catch (error) {
        console.error("Error saving Mandatory Disclosure:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
      }
    }
  },
  staffVisibilityController: {
    ...createController(StaffVisibility),
    saveOrUpdate: async (req, res) => {
      try {
        const { type = "designation" } = req.body;
        let doc = await StaffVisibility.findOne({ type });
        if (doc) {
          doc = await StaffVisibility.findByIdAndUpdate(doc._id, req.body, { new: true });
        } else {
          doc = new StaffVisibility(req.body);
          await doc.save();
        }
        res.status(200).json({ success: true, message: "Staff visibility updated successfully", data: doc });
      } catch (error) {
        console.error("Error updating Staff Visibility:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
      }
    }
  },
  eBulletinController: createController(EBulletin),
  eDiaryController: createController(EDiary),
  feedbackSubjectClassController: createController(FeedbackSubjectClass),
  feedbackSubjectTeacherController: createController(FeedbackSubjectTeacher),
  feedbackQuestionController: createController(FeedbackQuestion),
  feedbackTemplateController: createController(FeedbackTemplate)
};
