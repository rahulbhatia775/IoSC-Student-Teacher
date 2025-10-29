const Notice=require("../models/noticeSchema.js");

const noticeCreate = async (req, res) => {
  try {
    const { title, details, date, school } = req.body;

    if (!title || !details || !date || !school) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newNotice = await Notice.create({ title, details, date, school });
    res.status(201).json({ success: true, notice: newNotice });
  } catch (error) {
    console.error("Notice creation error:", error);
    res.status(500).json({ error: "Failed to create notice" });
  }
};

const noticeList = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ success: true, notices });
  } catch (error) {
    console.error("Notice fetch error:", error);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};

const updateNotice = async (req, res) => {
  try {
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedNotice) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json({ success: true, notice: updatedNotice });
  } catch (error) {
    console.error("Notice update error:", error);
    res.status(500).json({ error: "Failed to update notice" });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json({ success: true, message: "Notice deleted" });
  } catch (error) {
    console.error("Notice delete error:", error);
    res.status(500).json({ error: "Failed to delete notice" });
  }
};

const deleteNotices = async (req, res) => {
  try {
    await Notice.deleteMany();
    res.json({ success: true, message: "All notices deleted" });
  } catch (error) {
    console.error("Notice delete-all error:", error);
    res.status(500).json({ error: "Failed to delete notices" });
  }
};

module.exports = {noticeCreate,noticeList,updateNotice,deleteNotice,deleteNotices};