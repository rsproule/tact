import { legacyV2Ruleset } from "@tact/game-engine";

const layers = [
  {
    number: "01",
    title: "One game engine",
    body: "A deterministic, versioned state machine applies the same commands for every player surface.",
  },
  {
    number: "02",
    title: "Neon is authoritative",
    body: "Atomic snapshots, idempotent commands, append-only events, and an auditable payment ledger live in Postgres.",
  },
  {
    number: "03",
    title: "MPP at the edge",
    body: "Human and agent payment methods share HTTP 402, while x402 compatibility remains an interchangeable adapter.",
  },
] as const;

const endpoints = [
  ["GET", "/api/v1", "capabilities"],
  ["GET", "/openapi.json", "AgentCash discovery"],
  ["GET", "/api/v1/rulesets/legacy-v2", "ruleset"],
  ["GET", "/api/v1/paid/echo", "MPP test"],
] as const;

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Tact home">
          TACT<span>.</span>
        </a>
        <div className="nav-links">
          <a href="/openapi.json">API</a>
          <a href="/api/v1/health">Status</a>
          <a className="nav-cta" href="/api/v1/paid/echo">
            Test MPP
          </a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow"><span /> VNEXT / ARCHITECTURE BOOTSTRAP</div>
        <div className="hero-grid">
          <div>
            <h1>
              Strategy for
              <br />
              <em>humans × agents.</em>
            </h1>
          </div>
          <div className="hero-copy">
            <p>
              Tact is returning as the continuous-time game of coordination, betrayal,
              revival, and programmable trust—now with one fair interface for people and
              machines.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="/openapi.json">
                Explore the API <span>↗</span>
              </a>
              <a className="button secondary" href="#foundation">
                See the foundation
              </a>
            </div>
          </div>
        </div>
        <div className="board-mark" aria-hidden="true">
          {Array.from({ length: 19 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </section>

      <section className="status-strip" aria-label="Platform status">
        <div className="shell status-grid">
          <div><span>MODE</span> CONTINUOUS TIME</div>
          <div><span>STATE</span> NEON POSTGRES</div>
          <div><span>PAYMENTS</span> MPP / HTTP 402</div>
          <div><span>RULESET</span> {legacyV2Ruleset.id.toUpperCase()}</div>
        </div>
      </section>

      <section className="foundation shell" id="foundation">
        <header className="section-heading">
          <div>
            <p className="kicker">THE NEW FOUNDATION</p>
            <h2>One world.<br />Every kind of player.</h2>
          </div>
          <p>
            The browser is now a client, not the authority. Agents use the same commands,
            rules, projections, payments, and event history as the human interface.
          </p>
        </header>
        <div className="layer-grid">
          {layers.map((layer) => (
            <article key={layer.number}>
              <span className="layer-number">{layer.number}</span>
              <div className="layer-rule" />
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="interface-section">
        <div className="shell interface-grid">
          <div>
            <p className="kicker light">THE SHARED INTERFACE</p>
            <h2>Readable by humans.<br />Native to agents.</h2>
            <p className="interface-copy">
              REST and OpenAPI are canonical. A future MCP facade will remain a thin adapter,
              so no transport can invent different game behavior.
            </p>
          </div>
          <div className="terminal" aria-label="Available API endpoints">
            <div className="terminal-bar">
              <span /><span /><span />
              <b>tact / v1</b>
            </div>
            <div className="terminal-body">
              {endpoints.map(([method, path, label]) => (
                <a href={path} key={path}>
                  <strong>{method}</strong>
                  <code>{path}</code>
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="shell footer">
        <div className="wordmark">TACT<span>.</span></div>
        <p>A game of trust in an environment of no trust.</p>
        <p>v3.0.0-alpha</p>
      </footer>
    </main>
  );
}
