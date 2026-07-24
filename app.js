// ===============================================
// Import Required Modules
// ===============================================

// Import Express framework
const express = require("express");

// Create Express application
const app = express();

// Import MySQL connection
const db = require("./config/db");

// Port number
const port = 3000;


// ===============================================
// Middleware
// ===============================================

// Read JSON data sent from frontend
app.use(express.json());

// Serve HTML, CSS and JavaScript files
app.use(express.static("public"));


// ===============================================
// GET ALL STUDENTS
// ===============================================

app.get("/students", (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Database Error"
            });

        }

        res.json(result);

    });

});


// ===============================================
// GET ONE STUDENT
// ===============================================

app.get("/students/:id", (req, res) => {

    // Get student id from URL
    const id = req.params.id;

    const sql = "SELECT * FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database Error"
            });

        }

        // Student not found
        if (result.length === 0) {

            return res.status(404).json({
                message: "Student Not Found"
            });

        }

        // Return first student
        res.json(result[0]);

    });

});


// ===============================================
// ADD STUDENT
// ===============================================

app.post("/students", (req, res) => {

    const {

        name,

        email,

        age,

        course,

        percentage

    } = req.body;

    const sql = `
        INSERT INTO students
        (name,email,age,course,percentage)
        VALUES(?,?,?,?,?)
    `;

    db.query(

        sql,

        [

            name,

            email,

            age,

            course,

            percentage

        ],

        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.status(201).json({

                message: "Student Added Successfully"

            });

        }

    );

});


// ===============================================
// UPDATE STUDENT
// ===============================================

app.put("/students/:id", (req, res) => {

    const id = req.params.id;

    const {

        name,

        email,

        age,

        course,

        percentage

    } = req.body;

    const sql = `
        UPDATE students
        SET
            name=?,
            email=?,
            age=?,
            course=?,
            percentage=?
        WHERE id=?
    `;

    db.query(

        sql,

        [

            name,

            email,

            age,

            course,

            percentage,

            id

        ],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.json({

                message: "Student Updated Successfully"

            });

        }

    );

});


// ===============================================
// DELETE STUDENT
// ===============================================

app.delete("/students/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM students WHERE id=?";

    db.query(

        sql,

        [id],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.json({

                message: "Student Deleted Successfully"

            });

        }

    );

});


// ===============================================
// START SERVER
// ===============================================

app.listen(port, () => {

    console.log(`Server running at http://localhost:${port}`);

});