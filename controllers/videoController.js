import { error } from "console";
import fs from "fs";
import path from "path";

const streamVideo = (req, res) => {
  const { videoName } = req.params;

  const videoPath = path.join(process.cwd(), "public", videoName);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: "Video not found" });
  }

  const videoStats = fs.statSync(videoPath);
  const fileSize = videoStats.size;
  const range = req.headers.range;

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      return res
        .status(416)
        .json({ error: "Requested range is not satisfiable" });
    }

    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });

    const videoStream = fs.createReadStream(videoPath);
    videoStream.pipe(res);
  }
};

export default {
  streamVideo,
};
