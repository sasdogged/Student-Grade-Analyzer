const addBtn = document.getElementById("add-btn");
const studentsDiv = document.getElementById("students");
const removeFirst = document.getElementById("remove-first");
const removeLast = document.getElementById("remove-last");
const removeF = document.getElementById("remove-f");

const TOTAL_SCORE = document.getElementById("total")
const AVERAGE_SCORE = document.getElementById("average")
const HIGHEST_SCORE = document.getElementById("highest")
const LOWEST_SCORE = document.getElementById("lowest")

addBtn.addEventListener("click", () => {

  // Student Name and Score Inputs
  const studentName = document.getElementById("student-name");
  const studentScore = document.getElementById("student-score");
  const studentNameValue = studentName.value.trim();
  const studentScoreValue = Number(studentScore.value);

  // Error message
  const errorMess = document.querySelector(".error-message")
  if (
    !studentNameValue ||
    isNaN(studentScoreValue) ||
    studentScoreValue < 0 ||
    studentScoreValue > 100 ||
    !studentScoreValue
  ) {
    errorMess.classList.add("show")
    setTimeout(() => {
      errorMess.classList.remove("show")
    }, 3000)
    return;
  }

  let studentGradeValue;
  if (studentScoreValue >= 90) {
    studentGradeValue = "A";
  } else if (studentScoreValue >= 80 && studentScoreValue < 90) {
    studentGradeValue = "B";
  } else if (studentScoreValue >= 70 && studentScoreValue < 80) {
    studentGradeValue = "C";
  } else if (studentScoreValue >= 60 && studentScoreValue < 70) {
    studentGradeValue = "D";
  } else if (studentScoreValue >= 50 && studentScoreValue < 60) {
    studentGradeValue = "E";
  } else {
    studentGradeValue = "F";
  }

  // Create Elements
  const studentDiv = document.createElement("div");
  const nameScoreDiv = document.createElement("div");
  const gradeDelDiv = document.createElement("div");

  const nameParagraph = document.createElement("p");
  const scoreSpan = document.createElement("span");

  const gradeParagraph = document.createElement("p");
  const deleteBtn = document.createElement("button");

  // ClassList for Styling
  studentDiv.classList.add("student");
  nameScoreDiv.classList.add("name-score");
  gradeDelDiv.classList.add("grade-delete");
  nameParagraph.classList.add("name");
  scoreSpan.classList.add("score");
  gradeParagraph.classList.add("grade");
  deleteBtn.classList.add("del");

  //
  studentDiv.append(nameScoreDiv, gradeDelDiv);
  nameScoreDiv.append(nameParagraph, scoreSpan);
  gradeDelDiv.append(gradeParagraph, deleteBtn);

  //
  nameParagraph.textContent = `${studentNameValue}`;
  scoreSpan.textContent = `Score: ${studentScoreValue} / 100`;
  gradeParagraph.textContent = studentGradeValue;
  deleteBtn.textContent = "delete";

  studentsDiv.appendChild(studentDiv);

  const studentData = {
    name: studentNameValue,
    score: studentScoreValue,
    grade: studentGradeValue,
  };

  let students = JSON.parse(localStorage.getItem("studentData")) || [];
  if (!Array.isArray(students)) {
    students = [];
  }
  students.push(studentData);
  localStorage.setItem("studentData", JSON.stringify(students));

  studentName.value = "";
  studentScore.value = "";

  deleteBtn.addEventListener("click", () => {
    studentDiv.remove();

    const students = JSON.parse(localStorage.getItem("studentData")) || [];
    const index = Array.from(studentsDiv.children).indexOf(studentDiv);
    students.splice(index, 1);
    localStorage.setItem("studentData", JSON.stringify(students));


    updateStats()
  });

  updateStats()
  
});


// 
window.addEventListener("DOMContentLoaded", () => {
  let savedStudents = JSON.parse(localStorage.getItem("studentData")) || [];
  if (!Array.isArray(savedStudents)) {
    savedStudents = [];
  }

  savedStudents.forEach((student) => {
    const studentDiv = document.createElement("div");
    const nameScoreDiv = document.createElement("div");
    const gradeDelDiv = document.createElement("div");

    const nameParagraph = document.createElement("p");
    const scoreSpan = document.createElement("span");

    const gradeParagraph = document.createElement("p");
    const deleteBtn = document.createElement("button");

    studentDiv.classList.add("student");
    nameScoreDiv.classList.add("name-score");
    gradeDelDiv.classList.add("grade-delete");
    nameParagraph.classList.add("name");
    scoreSpan.classList.add("score");
    gradeParagraph.classList.add("grade");
    deleteBtn.classList.add("del");

    //
    studentDiv.append(nameScoreDiv, gradeDelDiv);
    nameScoreDiv.append(nameParagraph, scoreSpan);
    gradeDelDiv.append(gradeParagraph, deleteBtn);

    //
    nameParagraph.textContent = student.name;
    scoreSpan.textContent = `Score: ${student.score} / 100`;
    gradeParagraph.textContent = student.grade;
    deleteBtn.textContent = "delete";

    studentsDiv.appendChild(studentDiv);

    deleteBtn.addEventListener("click", () => {

      studentDiv.remove();

      const students = JSON.parse(localStorage.getItem("studentData")) || [];
      const index = Array.from(studentsDiv.children).indexOf(studentDiv);
      students.splice(index, 1);
      localStorage.setItem("studentData", JSON.stringify(students));

      updateStats()
    });
  });

  updateStats()

});

// Remove Students With an F Grade
removeF.addEventListener("click", function () {
  const students = document.querySelectorAll(".student");
  students.forEach((student) => {
    const gradeElem = student.querySelector(".grade");
    const gradeText = gradeElem.textContent;
    if (gradeText === "F") {
      student.remove();
    }

    updateStats()
  });

  // Update the localStorage
  const savedStudents = JSON.parse(localStorage.getItem("studentData")) || []
  const studentsWithoutF = savedStudents.filter(student => student.grade !== "F")
  localStorage.setItem("studentData", JSON.stringify(studentsWithoutF))

});

// /\/\/\/\/\ Add Five Extra Points
function addBonusPoints() {
  const students = document.querySelectorAll(".student")
  students.forEach((student) => {
    const scoreElem = student.querySelector(".score")

    const currentScore = parseInt(scoreElem.textContent.match(/\d+/)[0])
    const newScore = Math.min(currentScore + 5, 100)

    scoreElem.textContent = `Score: ${newScore} / 100`

    const gradeElem = student.querySelector(".grade")
    gradeElem.textContent = getLetterGrade(newScore)

    updateStats()
  })

  const savedStudents = JSON.parse(localStorage.getItem("studentData")) || []
    savedStudents.forEach((student) => {
      student.score = Math.min(student.score + 5, 100)
      student.grade = getLetterGrade(student.score)
    })
  localStorage.setItem("studentData", JSON.stringify(savedStudents))
}

function getLetterGrade(score) {

  if(score >= 90) return 'A'
  if(score >= 80 && score < 90) return 'B'
  if(score >= 70 && score < 80) return 'C'
  if(score >= 60 && score < 70) return 'D'
  if(score >= 50 && score < 60) return 'E'
  return 'F'
}

// Show Top Students
const topStudent = document.getElementById("top-students")
const headerTop = document.querySelector(".top3")
function showTopStudents() {

  const savedStudents = JSON.parse(localStorage.getItem("studentData")) || []
  const copyOfStudents = [...savedStudents]

  let sortedStudents = copyOfStudents.sort((a, b) => b.score - a.score)
  let top3 = sortedStudents.slice(0, 3)

  topStudent.innerHTML = ""
  top3.forEach((student, index) => {
    topStudent.innerHTML += `
      <p>${index + 1}.  ${student.name} -  ${student.score}<p/>
    `;
  })

  if(copyOfStudents.length === 0){
    headerTop.style.display = "none"
  } else{
    headerTop.style.display = "block"
  }
}

// Update Stats
function updateStats() {
  let students = JSON.parse(localStorage.getItem("studentData")) || [];

  if(students.length === 0 ){
    TOTAL_SCORE.textContent = 0;
    AVERAGE_SCORE.textContent = 0;
    HIGHEST_SCORE.textContent = 0;
    LOWEST_SCORE.textContent = 0;
    return;
  }

  // Total students
  const totalStudents = students.length
  TOTAL_SCORE.textContent = totalStudents

  // Average score of the students
  const sumOfScores = students.reduce((sum, student) => {
    return sum + student.score
  }, 0)
  const averageScore = (sumOfScores / totalStudents).toFixed(1)
  AVERAGE_SCORE.textContent = averageScore

  // Highest score
  const scores = students.map(student => student.score)
  const highestScore = Math.max(...scores)
  HIGHEST_SCORE.textContent = highestScore

  // Lowest score
  const lowestScore = Math.min(...scores)
  LOWEST_SCORE.textContent = lowestScore
}