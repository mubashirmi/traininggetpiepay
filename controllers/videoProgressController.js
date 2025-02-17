const { UserVideoStatus } = require("../models/index");

// Helper function to convert HH:MM:SS to minutes
const convertTimeToMinutes = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours * 60) + minutes + (seconds / 60);
};

exports.updateVideoProgress = async (req, res) => {
  const { videoId, userId } = req.params;
  const { currentTime } = req.body; // now expecting string "HH:MM:SS"

  if (!currentTime) {
    return res.status(400).json({ message: "currentTime is required in the request body." });
  }

  try {
    // Convert the HH:MM:SS string to minutes (as a number)
    const currentTimeInMinutes = convertTimeToMinutes(currentTime);

    // Use upsert to update if the record exists, or create a new one if it doesn't
    await UserVideoStatus.upsert({
      userId,
      videoId,
      currentTime: currentTimeInMinutes,
      // Optionally, update status to "started" if not already completed
      status: 'started'
    });

    res.status(200).json({ message: "Video progress updated successfully", currentTime: currentTimeInMinutes });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get Video Progress API
// Endpoint: GET /videos/:videoId/progress/:userId
const convertMinutesToTimeString = (minutes) => {
  const totalSeconds = Math.round(minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  // Pad with zeros if needed
  const pad = (num) => num.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
};

exports.getVideoProgress = async (req, res) => {
  const { videoId, userId } = req.params;

  try {
    const videoProgress = await UserVideoStatus.findOne({
      where: { userId, videoId }
    });

    if (!videoProgress) {
      return res.status(200).json({ message: "No progress found", currentTime: "00:00:00" });
    }

    // Convert the stored numeric minutes back to HH:MM:SS
    const currentTimeString = convertMinutesToTimeString(videoProgress.currentTime);

    res.status(200).json({
      videoId,
      userId,
      currentTime: currentTimeString,
      status: videoProgress.status
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};