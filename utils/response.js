function sendResponse(res, status, data, message = "") {
  // return res.status(status).json({ data, message });
  // jika message kosong, maka tidak perlu dikirim
  return res
    .status(status)
    .json({ ...(message && { message }), ...(data && { data }) });
}

module.exports = sendResponse;
