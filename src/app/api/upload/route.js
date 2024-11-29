// /pages/api/upload.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { file } = req.body;
  
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "YOUR_UPLOAD_PRESET");
  
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dm8jh1n7a/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to upload file");
        }
  
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }
  