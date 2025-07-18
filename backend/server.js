import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// load .env variables
dotenv.config();

// set up the server
const app = express();
app.use(cors());
//
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const submissionFilePath = path.join(__dirname, 'submissions.tsv');

// set up the initial Images database
// const images_database = new sqlite3.Database(':memory:');
// const submissions_database = new sqlite3.Database(':memory:');

const images_database = new sqlite3.Database('./images.db')
const submissions_database = new sqlite3.Database('./submissions.db')

function exportSubmissionsToTSV() {
  return new Promise((resolve, reject) => {
    submissions_database.all("SELECT * FROM submissions", (err, rows) => {
      if (err) {
        console.error("Failed to export submissions:", err);
        return reject(err);
      }

      const tsv = ["id\tpeople_depicted"];
      for (const row of rows) {
        tsv.push(`${row.id}\t${row.people_depicted || ""}`);
      }

      fs.writeFile(submissionFilePath, tsv.join("\n"), "utf-8", (err) => {
        if (err) {
          console.error("Error writing TSV file:", err);
          return reject(err);
        }
        console.log("Submissions exported to submissions.tsv");
        resolve();
      });
    });
  });
}


images_database.serialize(() => {
  images_database.run("CREATE TABLE images (id INTEGER PRIMARY KEY, title TEXT, dates TEXT, people_depicted TEXT)");

  const stmt = images_database.prepare("INSERT INTO images (id, title, dates, people_depicted) VALUES (?, ?, ?, ?)");
  const tsvData = fs.readFileSync("images.tsv", "utf-8").trim().split("\n").slice(1);

  for (const line of tsvData) {
    const [id, title, dates, people_depicted] = line.split("\t");
    stmt.run(id, title, dates, people_depicted);
  }

  stmt.finalize();
});

submissions_database.serialize(() => {
  submissions_database.run("CREATE TABLE submissions (id INTEGER PRIMARY KEY, people_depicted TEXT)");
});

// printing out the contents of the database, useful for debugging
function dbDump(db) {
  db.each("SELECT * FROM images", (err, row) => {
    if (err) {
      console.error("Error reading data:", err);
      return;
    }
    console.log(row);
  });
}

app.get('/image/:id', (req, res) => {
  const imagePath = path.join(__dirname, 'assets', `${req.params.id}.jpg`);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    console.log('Looking for image:', imagePath);
    res.status(404).send('Image not found');
  }
});

app.get('/all-metadata', (req, res) => {
  images_database.all("SELECT * FROM images", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json({ images: rows }); 
  });
});

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_TOKEN;

app.get('/admin/submissions', (req, res) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }

  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString();
  const [username, password] = credentials.split(':');

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(403).send('Forbidden');
  }

  submissions_database.all("SELECT * FROM submissions", (err, rows) => {
    if (err) {
      res.status(500).send('Database error');
    }

    res.json(rows);
  });
});

app.get('/download-submissions', (req, res) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }

  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString();
  const [username, password] = credentials.split(':');

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(403).send('Forbidden');
  }

  res.download(submissionFilePath);
});


// process the submissions of names and update the database
app.post('/add-name', express.json(), (req, res) => {
  const { picid, firstName, middleName, lastName } = req.body;
  if (!picid || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

  submissions_database.get("SELECT people_depicted FROM submissions WHERE id = ?", [picid], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database read failed' });
    }

    let updatedValue;
    if (row) {
      const existing = row.people_depicted ? row.people_depicted.split(';').map(s => s.trim()) : [];
      if (!existing.includes(fullName)) {
        existing.push(fullName);
      }
      updatedValue = existing.join('; ');
      submissions_database.run("UPDATE submissions SET people_depicted = ? WHERE id = ?", 
                                [updatedValue, picid],
                                function (err) {
                                  if (err) return res.status(500).json({ error: 'Update failed'});
                                  exportSubmissionsToTSV().then(() => {
                                    res.json({ success: true});
                                  }).catch((err) => {
                                    res.status(500).json({ error: 'TSV export failed' });
                                  });
                                }
                              );
    } else {
      updatedValue = fullName;
      submissions_database.run("INSERT INTO submissions (id, people_depicted) VALUES (?, ?)", 
                                [picid, updatedValue],

                                function (err) {
                                  if (err) return res.status(500).json({ error: 'Insert failed'});
                                  exportSubmissionsToTSV().then(() => {
                                    res.json({ success: true});
                                  }).catch((err) => {
                                    res.status(500).json({ error: 'TSV export failed' });
                                  });
                                }
      );
    }
  });
});


process.on('SIGINT', () => {
  console.log("\nShutting down server...");

  exportSubmissionsToTSV()
    .then(() => {
      console.log("Shutdown complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Shutdown failed:", err);
      process.exit(1);
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
