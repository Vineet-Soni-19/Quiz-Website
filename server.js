const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const xlsx = require("xlsx");
const cors = require('cors');


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, and JS)
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to fetch questions
app.get("/api/questions", (req, res) => {
    try {
        const excelFile = path.join(__dirname, "questions.xlsx");

        if (fs.existsSync(excelFile)) {
            const workbook = xlsx.readFile(excelFile);
            const sheetName = workbook.SheetNames[0];
            const questionsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            res.json({ questions: questionsData });
        } else {
            res.status(404).json({ error: "Questions file not found" });
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
