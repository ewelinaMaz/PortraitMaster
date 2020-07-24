const Photo = require("../models/photo.model");
const Voter = require("../models/Voters.model");
/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {
  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;

    if (title && author && email && file) {
      // if fields are not empty...
      const invalidSigns = /[<>%\$]/;;
      const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const fileName = file.path.split("/").slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
      const validExt = /(.*?)\.(jpg|jpeg|gif|png)$/; 
      /*form validation*/

      let isValid = true;
      if(!title, !author, !email, !file) {
        isValid = false;
        throw new Error('fill in the form');
      }
      else if (invalidSigns.test(title) || invalidSigns.test(author)) {
        isValid = false;
        throw new Error('form contains invalid characters');
      }
      else if (!emailPattern.test(email)) {
        isValid = false;
        throw new Error('invalid email address');
      } 
      else if (!validExt.test(email)) {
        isValid = false;
        throw new Error('invalid file format');
      }
      if (isValid) {
        const newPhoto = new Photo({
          title,
          author,
          email,
          src: fileName,
          votes: 0,
        });
        await newPhoto.save(); // ...save new photo in DB
        res.json(newPhoto);
      } else {
        throw new Error('Wrong input!');
      }
    } else {
      throw new Error("Wrong input!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {
  try {
    res.json(await Photo.find());
  } catch (err) {
    res.status(500).json(err);
  }
};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {
  try {
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    if (!photoToUpdate) res.status(404).json({ message: "Not found" });
    else {
      photoToUpdate.votes++;
      photoToUpdate.save();
      res.send({ message: "OK" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
