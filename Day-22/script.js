
// Mock "database" of student projects
const projects = [
  {
    id: 1,
    studentName: "Aarav Kumar",
    title: "Library Management System",
    category: "Web App",
    status: "completed",
    score: 92
  },
  {
    id: 2,
    studentName: "Priya Reddy",
    title: "Smart Attendance Tracker",
    category: "IoT",
    status: "in-progress",
    score: 78
  },
  {
    id: 3,
    studentName: "Rahul Sharma",
    title: "College Bus Route Planner",
    category: "Mobile App",
    status: "not-started",
    score: 0
  },
  {
    id: 4,
    studentName: "Sita Devi",
    title: "Student Result Analyzer",
    category: "Data Science",
    status: "completed",
    score: 88
  },
  {
    id: 5,
    studentName: "Vikram Singh",
    title: "Hostel Complaint Portal",
    category: "Web App",
    status: "in-progress",
    score: 65
  },
  {
    id: 6,
    studentName: "Lakshmi Rao",
    title: "Online Quiz Platform",
    category: "Web App",
    status: "completed",
    score: 95
  }
];

// DOM elements
const statusFilterEl = document.getElementById("statusFilter");
const searchInputEl = document.getElementById("searchInput");
const minScoreEl = document.getElementById("minScore");
const resetBtn = document.getElementById("resetBtn");

const totalProjectsEl = document.getElementById("totalProjects");
const completedProjectsEl = document.getElementById("completedProjects");
const averageScoreEl = document.getElementById("averageScore");
const maxScoreEl = document.getElementById("maxScore");
const projectsBodyEl = document.getElementById("projectsBody");

// Utility: format status to CSS class
function getStatusClass(status) {
  switch (status) {
    case "completed":
      return "status-completed";
    case "in-progress":
      return "status-in-progress";
    case "not-started":
    default:
      return "status-not-started";
  }
}

/**
 * Core pipeline: uses FILTER, MAP, REDUCE
 * - filter(): by status, search text, and min score
 * - map(): convert project objects to table row HTML strings
 * - reduce(): calculate stats (total, completed, average, max)
 */
function renderDashboard() {
  const statusFilter = statusFilterEl.value; // all | not-started | in-progress | completed
  const searchText = searchInputEl.value.trim().toLowerCase();
  const minScore = Number(minScoreEl.value) || 0;

  // 1. FILTER: select projects based on controls
  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      statusFilter === "all" ? true : project.status === statusFilter;

    const matchesSearch =
      searchText.length === 0
        ? true
        : project.studentName.toLowerCase().includes(searchText) ||
          project.title.toLowerCase().includes(searchText);

    const matchesScore = project.score >= minScore;

    return matchesStatus && matchesSearch && matchesScore;
  });

  // 2. REDUCE: derive statistics from the filtered list
  const stats = filteredProjects.reduce(
    (acc, project) => {
      acc.total += 1;
      if (project.status === "completed") {
        acc.completed += 1;
      }
      acc.scoreSum += project.score;
      if (project.score > acc.maxScore) {
        acc.maxScore = project.score;
      }
      return acc;
    },
    { total: 0, completed: 0, scoreSum: 0, maxScore: 0 }
  );

  const avgScore =
    stats.total > 0 ? (stats.scoreSum / stats.total).toFixed(1) : 0;

  // Update stats UI
  totalProjectsEl.textContent = stats.total;
  completedProjectsEl.textContent = stats.completed;
  averageScoreEl.textContent = avgScore;
  maxScoreEl.textContent = stats.maxScore;

  // 3. MAP: generate HTML rows from filteredProjects
  const rowsHtml = filteredProjects
    .map((project) => {
      return `
        <tr>
          <td>${project.studentName}</td>
          <td>${project.title}</td>
          <td>${project.category}</td>
          <td>
            <span class="status-pill ${getStatusClass(project.status)}">
              ${project.status.replace("-", " ")}
            </span>
          </td>
          <td>${project.score}</td>
        </tr>
      `;
    })
    .join("");

  // If no rows, show an empty state
  projectsBodyEl.innerHTML =
    rowsHtml ||
    `<tr><td colspan="5" style="text-align:center; color:#6b7280; padding:1rem;">
        No projects match the current filters.
      </td></tr>`;
}

// Event listeners
statusFilterEl.addEventListener("change", renderDashboard);
searchInputEl.addEventListener("input", renderDashboard);
minScoreEl.addEventListener("input", renderDashboard);

resetBtn.addEventListener("click", () => {
  statusFilterEl.value = "all";
  searchInputEl.value = "";
  minScoreEl.value = 0;
  renderDashboard();
});

// Initial render
renderDashboard();
