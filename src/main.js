import "./style.css";

// Injected at image build time via Docker --build-arg (see Dockerfile)
const env = import.meta.env;
const build = [
  ["Version", env.VITE_APP_VERSION],
  ["Commit", env.VITE_GIT_COMMIT],
  ["Branch", env.VITE_GIT_BRANCH],
  ["Built", env.VITE_BUILD_TIME],
  ["Pipeline run", env.VITE_PIPELINE_RUN],
];

document.querySelector("#app").innerHTML = `
  <header>
    <h1>Release status</h1>
    <p id="health" class="pill pending">Checking service…</p>
  </header>
  <section>
    <h2>This build</h2>
    <dl>
      ${build.map(([k, v]) => `<dt>${k}</dt><dd>${v || "not set"}</dd>`).join("")}
    </dl>
  </section>
  <footer>Served from <span id="host"></span></footer>
`;

document.querySelector("#host").textContent = location.host;

async function checkHealth() {
  const el = document.querySelector("#health");
  try {
    const res = await fetch("/healthz", { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    el.textContent = `Healthy · checked ${new Date().toLocaleTimeString()}`;
    el.className = "pill ok";
  } catch {
    el.textContent = "Service not responding";
    el.className = "pill bad";
  }
}

checkHealth();
setInterval(checkHealth, 15000);
