require("dotenv").config();
const express = require("express");
const { valid } = require("semver");
const app = express();



app.use(express.json());

// let students = [];
let students = [
  { id: 1, name: "Crown Aluka", email: "crown.aluka@gmail.com", age: 22, course: "Computer Science" },
  { id: 2, name: "Eirene Okafor", email: "eirene.okafor@gmail.com", age: 21, course: "Law" },
  { id: 3, name: "Michael Jaiyeoba", email: "michael.jaiyeoba@gmail.com", age: 23, course: "Engineering" },
  { id: 4, name: "Clever Peters", email: "clever.peters@gmail.com", age: 20, course: "Medicine" },
  { id: 5, name: "Sandra Obi", email: "sandra.obi@gmail.com", age: 24, course: "Accounting" },
];

let nextId = 6;


//CREATE Student record -----------By <Crown Aluka>
app.post("/api/students", (req, res) => {
    const { name, email, age, course } = req.body ?? {};

    const cleanedName = name?.trim();
    const cleanedEmail = email?.trim().toLowerCase();
    const cleanedCourse = course?.trim();

    if (!cleanedName || !cleanedEmail || !age || !cleanedCourse) {
        return res
            .status(400)
            .json({ success: false, err: "Some fields are missing!" });
    }



    if (!Number.isInteger(age)) {
        return res.status(400).json({ success: false, err: "Age must be a number" });
    }

    if (students.some((stud) => stud.email === cleanedEmail)) {
        return res.status(400).json({ success: false, err: "Email taken" });
    }

    const newStudent = {
        id: nextId++,
        name: cleanedName,
        email: cleanedEmail,
        age: age,
        course: cleanedCourse
    };

    students.push(newStudent);

    return res.status(201).json({
        success: true,
        data: newStudent,
        message: `Student (${newStudent.id}) created successfully`,
    });
});




//LISTING --- By Eirene.
app.get("/api/students", (req, res) => {
    return res.status(200).json({
        success: true,
        count: students.length,
        data: students,
    });
});


// -----GET student by ID---------
app.get("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const student = students.find((s) => s.id === id);

    if (!student) {
        return res.status(404).json({ success: false, err: "Student not found" });
    }

    return res.status(200).json({ sucess: true, data: student });
});




// UPDATING(PUT) - By Jaiyeoba Michael.
app.put("/api/students/:id", (req, res) => {
    const studentid = Number(req.params.id);
    const { name, email, age, course } = req.body ?? {};

    const index = students.findIndex((s) => s.id === studentid);
    if (index === -1) {
        return res.status(404).json({ success: false, err: "Student not found" });
    }

    if (name !== undefined) {
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ success: false, err: "Please provide a valid name" });
        }
        students[index].name = name.trim();
    }

    if (email !== undefined) {
        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ success: false, err: "Please provide a valid email" });
        }
        const cleanedEmail = email.trim().toLowerCase();
        if (students.some((s) => s.email === cleanedEmail && s.id !== studentid)) {
            return res.status(400).json({ success: false, err: "Email taken" });
        }
        students[index].email = cleanedEmail;
    }

    if (age !== undefined) {
        if (!Number.isInteger(age)) {
            return res.status(400).json({ success: false, err: "Age must be a number" });
        }
        students[index].age = age;
    }

    if (course !== undefined) {
        if (typeof course !== "string" || !course.trim()) {
            return res.status(400).json({ success: false, err: "Please provide a valid course" });
        }
        students[index].course = course.trim();
    }

    return res.status(200).json({ success: true, data: students[index], message: "Student updated" });
});



app.delete("/api/students/:id", (req, res) => {
    const studentId = Number(req.params.id);
    const student = students.find(stud => stud.id === studentId);
    if (!student) {

        return res.status(404).json({ success: false, err: "Student not found" });
    }

    students = students.filter(stud => stud.id !== studentId);
    return res.status(200).json({ success: true, message: `Student with (${studentId}) deleted successfully` });
})







// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n Server runing on http://localhost:${PORT}`);
});