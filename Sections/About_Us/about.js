fetch("/data/about.json")
  .then((res) => res.json())
  .then((data) => {
    const timelineContainer = document.getElementById("timeline-container");
    data.milestones.forEach((m) => {
      const div = document.createElement("div");
      div.className = "timeline-card";
      div.innerHTML = `
        <div class="year-badge">${m.year} ${m.icon}</div>
        <h3>${m.title}</h3>
        <p>${m.description}</p>
        <img src="${m.image}" alt="${m.title}" />
        <div class="stats">
          <div>📁 ${m.stats.projects} Proyek</div>
          <div>👥 ${m.stats.clients} Klien</div>
          <div>🏢 ${m.stats.team} Tim</div>
        </div>
      `;
      timelineContainer.appendChild(div);
    });

    const valuesContainer = document.getElementById("values-container");
    data.values.forEach((v) => {
      const div = document.createElement("div");
      div.className = "value-card";
      div.innerHTML = `
        <div class="icon">${v.icon}</div>
        <h3>${v.title}</h3>
        <p>${v.description}</p>
      `;
      valuesContainer.appendChild(div);
    });
  });
