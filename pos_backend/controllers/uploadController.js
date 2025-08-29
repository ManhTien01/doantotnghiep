const uploadImage = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file được tải lên." });
    }
  
    const imageUrl = `/images/menu/${req.file.filename}`; // Đường dẫn ảnh
    return res.status(200).json({ imageUrl });
  };
  
  module.exports = { uploadImage };
  