const Device = require('../models/Device');
const asyncHandler = require('express-async-handler');
const { multipleMongooseToObjectPage } = require('../../util/mongoose');
const Papa = require('papaparse');

class HomeController {
  //[Get] /
  index = asyncHandler(async (req, res, next) => {
    const itemsPerPage = 10;
    const currentPage = parseInt(req.query.page) || 1;

    try {
      const totalDevices = await Device.countDocuments();
      const totalPages = Math.ceil(totalDevices / itemsPerPage);
      const skip = (currentPage - 1) * itemsPerPage;
      const prevPage = currentPage - 1;
      const nextPage = currentPage + 1;
      const devices = await Device.find().skip(skip).limit(itemsPerPage).lean();

      res.render('home', {
        devices: multipleMongooseToObjectPage(devices, currentPage),
        totalPages,
        prevPage,
        nextPage,
        itemsPerPage,
      });
    } catch (err) {
      next(err);
    }
  });

  // [Post] /upload
  uploadFile = asyncHandler(async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No files were uploaded.');
    }

    const deviceFile = req.files.file;
    const csvData = await deviceFile.data.toString();

    try {
      Papa.parse(csvData, {
        header: true,
        ignoreEmpty: true,
        skipEmptyLines: true,
        fastMode: true,
        chunk: async (results) => {
          const data = results.data;
          const insertBatches = async () => {
            let insertedCount = 0;
            while (data.length > 0) {
              const batch = data.splice(0, 100);
              await Device.deleteMany({
                _id: { $in: batch.map((data) => data._id) },
              });
              await Device.insertMany(batch);
              insertedCount += batch.length;
            }
          };
          await insertBatches();
        },
        complete: () => {
          res.redirect('/');
        },
      });
    } catch (err) {
      console.error('Error during upload:', err);
      res.status(500).send('An error occurred during upload.');
    }
  });

  // [Post] /delete
  deleteDB = asyncHandler(async (req, res) => {
    try {
      await Device.deleteMany({}); // Delete all documents in the Device collection
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while deleting the collection.');
    }
  });
}

module.exports = new HomeController();
