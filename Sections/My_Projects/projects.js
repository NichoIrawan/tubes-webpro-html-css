import "../../Components/navbar.js";
import "../../Components/footer.js";

const getStatusClass = (status) => {
  switch (status) {
    case "DONE":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    case "RETENTION":
      return "retention";
    case "IN_CONSTRUCTION":
    case "CONFIRMATION":
    case "PAYMENT":
      return "ongoing";
    default:
      return "";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "DONE":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "RETENTION":
      return "Retention";
    case "IN_CONSTRUCTION":
      return "In Construction";
    case "CONFIRMATION":
      return "Confirmation";
    case "PAYMENT":
      return "Waiting for Payment";
    default:
      return "Unknown";
  }
};

const getTypeLabel = (type) => {
  switch (type) {
    case "RUMAH":
      return "House";
    case "APARTMENT":
      return "Apartment";
    case "KOMERSIL":
      return "Commercial";
    default:
      return "Unknown";
  }
};

const getProjectTypeIcon = (type) => {
  switch (type) {
    case "RUMAH":
      return "/Assets/House_Type_Illustration.png";
    case "APARTMENT":
      return "/Assets/House_Type_Illustration.png";
    case "KOMERSIL":
      return "/Assets/House_Type_Illustration.png";
    default:
      return "/Assets/House_Type_Illustration.png";
  }
};

let windowStart = 0;

function renderOngoingProjectWindow(ongoingProjects, activeIndex = 1) {
  const ongoingProjectList = document.getElementById("ongoing-project-list");
  const indicatorList = document.getElementById(
    "ongoing-project-list-indicator"
  );

  ongoingProjectList.innerHTML = "";

  let limitSize = 3;

  for (
    let i = 0;
    i < limitSize && i + windowStart < ongoingProjects.length;
    i++
  ) {
    const project = ongoingProjects[i + windowStart];
    const card = document.createElement("div");
    card.className = `project-card ${i === activeIndex ? "active" : ""}`;
    card.innerHTML = `
      <div class="content">
        <img src="${getProjectTypeIcon(project.jenis_proyek)}" alt="${
      project.jenis_proyek
    }">
        <h3>${project.nama_proyek}</h3>
        <div class="status">
          <div class="indicator"></div>
          <p>${getStatusLabel(project.status)}</p>
        </div>
      </div>
      <a class="button-primary white-arrow" href="/Sections/My_Projects/Project_Details/page.html?id=${
        project.id_proyek
      }">
        See Details
        <img src="/Assets/arrow_forward.svg" alt="arrow_forward">
      </a>
    `;
    ongoingProjectList.appendChild(card);
  }

  // Update indicators
  indicatorList.innerHTML = "";
  ongoingProjects.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.className = `indicator ${
      index === windowStart + activeIndex ? "active" : ""
    }`;
    indicatorList.appendChild(indicator);
  });

  // Add click handlers
  const projectCards = document.querySelectorAll(
    "#ongoing-project-list .project-card"
  );
  projectCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      const globalIndex = index + windowStart;
      const cardPosition = index;

      projectCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      const indicators = document.querySelectorAll(
        "#ongoing-project-list-indicator .indicator"
      );
      indicators.forEach((ind) => ind.classList.remove("active"));
      indicators[globalIndex]?.classList.add("active");

      if (
        cardPosition === limitSize - 1 &&
        globalIndex < ongoingProjects.length - 1
      ) {
        windowStart++;
        renderOngoingProjectWindow(ongoingProjects, 1);
      } else if (cardPosition === 0 && windowStart > 0) {
        windowStart--;
        renderOngoingProjectWindow(ongoingProjects, 1);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch projects data
    const response = await fetch("/data/projects.json");
    const data = await response.json();
    const projects = data.projects;

    // Populate ongoing projects section
    const ongoingProjects = projects.filter((project) =>
      ["IN_CONSTRUCTION", "CONFIRMATION", "PAYMENT"].includes(project.status)
    );

    // Reset window start
    windowStart = 0;

    // Initial render of ongoing projects
    renderOngoingProjectWindow(ongoingProjects, 1);

    // Populate all projects section
    const projectListRight = document.querySelector(".project-list-right");
    projectListRight.innerHTML = "";

    projects.forEach((project) => {
      const card = document.createElement("div");
      card.className = `project-card-right ${getStatusClass(project.status)}`;
      card.innerHTML = `
        <div class="meta">
          <img src="${getProjectTypeIcon(project.jenis_proyek)}" alt="${
        project.nama_proyek
      }">
          <h3>${project.nama_proyek}</h3>
          <p>${getTypeLabel(project.jenis_proyek)}</p>
        </div>
        <a class="button-primary black-arrow" href="/Sections/My_Projects/Project_Details/page.html?id=${
          project.id_proyek
        }">
          See Details
          <img src="/Assets/arrow_forward.svg" alt="arrow_forward">
        </a>
      `;
      projectListRight.appendChild(card);
    });

    // Add click handlers for filter buttons
    const filterButtons = document.querySelectorAll(".project-tags .tag");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.value;
        const cards = document.querySelectorAll(".project-card-right");

        cards.forEach((card) => {
          if (filter === "all") {
            card.style.display = "flex";
          } else {
            card.style.display = card.classList.contains(filter)
              ? "flex"
              : "none";
          }
        });
      });
    });
  } catch (error) {
    console.error("Error loading projects:", error);
  }
});
