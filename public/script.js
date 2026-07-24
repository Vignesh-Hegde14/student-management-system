// This variable tells us whether we are adding a new student
// or editing an existing one.
let editingStudentId = null;

// ===============================
// Check Course Eligibility
// ===============================
function checkEligibility(course, percentage) {

    switch (course) {

        case "BCA":
            return percentage >= 50;

        case "BSc":
            return percentage >= 60;

        case "BCom":
            return percentage >= 45;

        case "Engineering":
            return percentage >= 70;

        default:
            return false;
    }
}

// ===============================
// Add Student
// ===============================
async function addStudent() {

    // Get values from input boxes
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;
    const percentage = Number(document.getElementById("percentage").value);

    // Store selected courses
    let selectedCourses = document.querySelector(".course:checked").value;

    // Validation
    if (
        name === "" ||
        email === "" ||
        age === "" ||
        percentage === "" ||
        selectedCourses.length === 0
    ) {
        alert("Please fill all fields.");
        return;
    }

    // Create object to send to backend
    const student = {
        name,
        email,
        age,
        percentage,
        course: selectedCourses
    };

    // Send data to Express backend
    const response = await fetch("/students", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(student)

    });

    const data = await response.json();

    alert(data.message);

    // Clear form
    clearForm();

  
}

// ===============================
// Load Students
// ===============================
async function loadStudents() {

    const response = await fetch("/students");

    const students = await response.json();

    let output = "";

    students.forEach((student) => {

        
       

         let eligibilityText = "";

       
      

            const eligible = checkEligibility(
                student.course,
                student.percentage
            );

            eligibilityText += `
                <p class="${
                    eligible ? "eligible" : "notEligible"
                }">

                    ${student.course} :
                    ${
                        eligible
                            ? "Eligible"
                            : "Not Eligible"
                    }

                </p>
            `;
        

        output += `

        <div class="student">

            <h2>${student.name}</h2>

            <p><b>Email:</b> ${student.email}</p>

            <p><b>Age:</b> ${student.age}</p>

            <p><b>Course:</b> ${student.course}</p>

            <p><b>PU Percentage:</b> ${student.percentage}%</p>

            ${eligibilityText}

            <button
                class="edit"
                onclick="editStudent(${student.id})">

                Edit

            </button>

            <button
                class="delete"
                onclick="deleteStudent(${student.id})">

                Delete

            </button>

        </div>

        `;

    });

    // Display students
    document.getElementById("students").innerHTML = output;

}

// ===============================
// Clear Form
// ===============================
function clearForm() {

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("age").value = "";
    document.getElementById("percentage").value = "";

    // Uncheck all course checkboxes
    document.querySelectorAll(".course").forEach((course) => {
        course.checked = false;
    });

}

// ==========================================
// Edit Student
// ==========================================
async function editStudent(id) {

    // Store the ID of the student being edited
    editingStudentId = id;

    // Request one student from the backend
    const response = await fetch(`/students/${id}`);

    // Convert JSON into JavaScript object
    const student = await response.json();

    // Fill the form with student details
    document.getElementById("name").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("age").value = student.age;
    document.getElementById("percentage").value = student.percentage;

    // Uncheck all checkboxes first
    document.querySelectorAll(".course").forEach((course) => {
        course.checked = false;
    });

    // Convert course string into array
    // Example:
    // "BCA, BSc"
    // becomes
    // ["BCA","BSc"]

    const selectedCourses = student.course.split(",");

    // Check appropriate checkboxes
    document.querySelectorAll(".course").forEach((checkbox) => {

        if (
            selectedCourses.includes(
                checkbox.value
            )
        ) {
            checkbox.checked = true;
        }

    });

    // Change button text
    const addButton = document.querySelector(".add");

    addButton.innerText = "Update Student";

    // Change button function
    addButton.onclick = updateStudent;
}

//
// ==========================================
// Update Student
// ==========================================
async function updateStudent() {

    // Read values from form
    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const age = document.getElementById("age").value;

    const percentage = Number(
        document.getElementById("percentage").value
    );

    // Store selected courses
    let selectedCourses = [];

    document
        .querySelectorAll(".course:checked")
        .forEach((course) => {

            selectedCourses.push(course.value);

        });

    // Create updated object
    const student = {

        name,

        email,

        age,

        percentage,

        course: selectedCourses.join(", ")

    };

    // Send PUT request
    const response = await fetch(
        `/students/${editingStudentId}`,
        {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(student)

        }
    );

    const data = await response.json();

    alert(data.message);

    // Reset form
    clearForm();

    // Change button back
    const addButton = document.querySelector(".add");

    addButton.innerText = "Add Student";

    addButton.onclick = addStudent;

    editingStudentId = null;

   

}

//
// ==========================================
// Delete Student
// ==========================================
async function deleteStudent(id) {

    // Ask confirmation
    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );

    if (!confirmDelete)
        return;

    const response = await fetch(

        `/students/${id}`,

        {

            method: "DELETE"

        }

    );

    const data = await response.json();

    alert(data.message);

  

}