document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburgerBtn");
  const rightPanel = document.getElementById("rightPanel");
  const closeBtn = document.getElementById("closePanel");
  const sections = document.querySelectorAll(".fade-section, .card");
  const finalImage = document.getElementById("finalImage");
  const introSection = document.getElementById("introSection");
  const projectNav = document.getElementById("projectNav");

  // --- Open / close the right-side panel ---
  if (hamburger && rightPanel) {
    hamburger.addEventListener("click", () => {
      rightPanel.classList.toggle("open");
      rightPanel.setAttribute(
        "aria-hidden",
        rightPanel.classList.contains("open") ? "false" : "true"
      );
    });
  }
  if (closeBtn && rightPanel) {
    closeBtn.addEventListener("click", () => {
      rightPanel.classList.remove("open");
      rightPanel.setAttribute("aria-hidden", "true");
    });
  }

  // --- Smooth appearance of sections when scrolled into view ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  sections.forEach((section) => observer.observe(section));

  // --- Common function for showing/hiding hamburger and top navigation ---
  function updateDynamicElementsVisibility() {
    const scrollY = window.scrollY;
    const viewportH = window.innerHeight;
    const introHeight = introSection ? introSection.offsetHeight : viewportH;
    const showTrigger = introHeight * 0.8;

    let finalTopViewport = Infinity;
    if (finalImage) finalTopViewport = finalImage.getBoundingClientRect().top;

    const hideWhenFinalNearTopPx = 100;
    const shouldShow =
      scrollY > showTrigger && finalTopViewport > hideWhenFinalNearTopPx;

    if (hamburger) {
      shouldShow
        ? hamburger.classList.add("visible")
        : hamburger.classList.remove("visible");
    }

    if (projectNav) {
      shouldShow
        ? projectNav.classList.add("visible")
        : projectNav.classList.remove("visible");
    }
  }

  updateDynamicElementsVisibility();
  window.addEventListener("scroll", () =>
    requestAnimationFrame(updateDynamicElementsVisibility)
  );
  window.addEventListener("resize", updateDynamicElementsVisibility);
});


// === D3 VISUALIZATION ===
document.addEventListener("DOMContentLoaded", function () {
  const chartDiv = d3.select("#timeSpendChart");
  if (chartDiv.empty()) return; // Do nothing if the chart section doesn't exist

  const width = chartDiv.node().clientWidth;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };

  const svg = chartDiv
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.csv("media/df_MagnusMoves.csv").then((data) => {
    console.log("✅ CSV loaded:", data.slice(0, 5)); // Debug: check first rows of the dataset

    // Convert string values to numbers
    data.forEach((d) => {
      d.TimeSpend = +d.TimeSpend;
    });

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.TimeSpend))
      .nice()
      .range([margin.left, width - margin.right]);

    const bins = d3
      .bin()
      .domain(x.domain())
      .thresholds(30)(data.map((d) => d.TimeSpend));

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const bar = svg
      .append("g")
      .selectAll(".bar")
      .data(bins)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.x0) + 1)
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => y(0) - y(d.length))
      .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "axis")
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    // X-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .style("font-size", "0.9rem")
      .text("Time Spent");

    // Y-axis label
    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .style("font-size", "0.9rem")
      .text("Frequency");
  });
});
