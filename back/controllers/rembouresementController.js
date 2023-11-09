const express = require("express");
const { Remboursement } = require("../models/Remboursement");
const multer = require("multer");
const fs = require("fs");
var mime = require("mime-types");
const app = express();

const path = require("path");

app.disable("x-powered-by");

const router = express.Router();

const docStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    let id = req.body.id;
    let storage = `storage/remboursement/${id}`;

    if (!fs.existsSync(storage)) {
      fs.mkdirSync(storage, { recursive: true });
    }
    callBack(null, storage);
  },
  filename: (req, file, callBack) => {
    let id = req.body.id;
    let fileName = req.body.docname + ".pdf";
    let filePath = `storage/remboursement/${id}/${fileName}`;

    if (fs.existsSync(filePath)) {
      // Remove the existing file
      fs.unlinkSync(filePath);
    }
    callBack(null, fileName);
  },
});
const uploadDocs = multer({ storage: docStorage });

app.post("/upload-docs/", uploadDocs.single("file"), (req, res, next) => {
  const doc = req.file;
  if (!doc) {
    const error = new Error("Aucun fichier chargé");
    error.httpStatusCode = 400;
    return next(error);
  }
 
  res.status(200).json("file");
});





app.get("/download-docs/:id", (req, res) => {
  let filePath = path.join(
    "storage",
    "remboursement",
    req.params.id.toString(),
    req.headers.file.toString() + ".pdf"
  );
  let fileExtention = "pdf";

  try {
    let file = fs.readFileSync(filePath, { encoding: "base64" }, (error) => {
      if (error) {
        res.status(400).json({ error: error });
      }
    });
    res.status(200).json({ file: file, extension: fileExtention });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

app.get("/get-doc-by-demande/:id", (req, res) => {
  let id = req.params.id;
  let file = req.body.file;
  let fileOne;
  let filenames = fs.readdirSync("storage/remboursement/" + id);
  if (filenames)
    fileOne = {
      file: fs.readFileSync(
        "storage/remboursement/" + id + "/" + file + ".pdf",
        { encoding: "base64" },
        (err) => {
          if (err) return console.error(err);
        }
      ),
      extension: "pdf",
      url: "",
    };
  res.status(200).send({ fileOne });
});
app.delete('/delete-doc/:id/:file', async (req, res) => {
  try {
    const id = req.params.id;
    const file = req.params.file;
    const filePath = `storage/remboursement/${id}/${file}.pdf`;

    if (fs.existsSync(filePath)) {
      const demande = await Remboursement.findOne({ _id: id });

      if (!demande) {
        return res.status(404).send('Remboursement record not found.');
      }

      if (demande.docs[file]) {
        fs.unlinkSync(filePath);

        demande.docs[file] = null;

        await demande.save();

        return res.status(204).send();
      } else {
        return res.status(404).send('File not found in Remboursement record.');
      }
    } else {
      return res.status(404).send('File not found on the server.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete the file.');
  }
});

app.post("/newremb", async (req, res) => {
  const remboussement = await Remboursement.findOne({
    "student.email": req.body.student.email,
  });
  if (remboussement) {
    res
      .status(500)
      .json({ message: "une demande avec cette addresse existe déja!" });
  } else {
    try {
      const newRemboursement = new Remboursement(req.body);
      const savedRemboursement = await newRemboursement.save();
      res.status(201).json(savedRemboursement);
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la création du remboursement." });
    }
  }
});

app.get("/getAll", (req, res) => {
  Remboursement.find()
    .sort({ _id: -1 })
    .then((r) => {
      res.send(r);
    });
});

app.get("/:id", async (req, res) => {
  try {
    const remboussement = await Remboursement.findById(req.params.id);
    if (!remboussement) {
      return res.status(404).json({ message: "Remboursement introuvable." });
    }
    res.status(200).json(remboussement);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du remboursement." });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const updatedRemboussement = await Remboursement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedRemboussement) {
      return res.status(404).json({ message: "Remboursement introuvable." });
    }
    res.status(200).json(updatedRemboussement);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du remboursement." });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const deletedRemboussement = await Remboursement.findByIdAndDelete(
      req.params.id
    );
    if (!deletedRemboussement) {
      return res.status(404).json({ message: "Remboursement introuvable." });
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du remboursement." });
  }
});
// app.get('/findDemandeByDocNumber/:docNumber', async (req, res) => {
//     const docNumber = req.params.docNumber;

//     try {
//       const demande = await findDemandeByDocNumber(docNumber);

//       if (!demande) {
//         return res.status(404).json({ message: 'Demande not found' });
//       }

//       res.status(200).json(demande);
//     } catch (error) {
//       res.status(500).json({ message: 'Error while retrieving demande' });
//     }
//   });

module.exports = app;
