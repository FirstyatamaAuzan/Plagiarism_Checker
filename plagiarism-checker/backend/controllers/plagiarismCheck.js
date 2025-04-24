const plagiarismCheckService = require("../services/plagiarismCheck");
const pdfParse = require("pdf-parse");

exports.checkText = async (req, res) => {
  try {
    const text = req.body?.text?.trim();
    const result = await plagiarismCheckService.checkPlagiarismPerURL(text);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Terjadi kesalahan saat memproses teks"
    });
  }
};

exports.checkFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File tidak ditemukan" });

    let fileContent = "";
    if (req.file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(req.file.buffer);
      fileContent = pdfData.text;
    } else {
      fileContent = req.file.buffer.toString("utf-8");
    }

    const result = await plagiarismCheckService.checkPlagiarismPerURL(fileContent);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Terjadi kesalahan saat memproses file"
    });
  }
};

exports.checkUrl = async (req, res) => {
  try {
    let url = req.body?.url?.trim();
    if (!url) return res.status(400).json({ error: "URL tidak valid" });
    
    if (!/^https?:\/\//i.test(url)) url = "http://" + url;
    
    const content = await plagiarismCheckService.fetchPageContent(url);
    if (!content) return res.status(500).json({ error: "Gagal mengambil konten dari URL" });
    
    const result = await plagiarismCheckService.checkPlagiarismPerURL(content);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Terjadi kesalahan saat memproses URL"
    });
  }
};