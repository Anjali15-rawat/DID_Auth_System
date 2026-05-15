-- DID Registry
CREATE TABLE IF NOT EXISTS did_registry (
  did TEXT PRIMARY KEY,
  owner_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Fraud Events
CREATE TABLE IF NOT EXISTS fraud_events (
  id SERIAL PRIMARY KEY,
  tx_id TEXT NOT NULL,
  model TEXT NOT NULL,
  fraud_score NUMERIC NOT NULL,
  reason JSONB,
  ts TIMESTAMP NOT NULL DEFAULT now()
);

-- Telemetry Events
CREATE TABLE IF NOT EXISTS telemetry_events (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB,
  ts TIMESTAMP NOT NULL DEFAULT now()
);

-- Incidents (correlated threats)
CREATE TABLE IF NOT EXISTS incidents (
  id SERIAL PRIMARY KEY,
  title TEXT,
  severity TEXT CHECK (severity IN ('low','medium','high','critical')),
  state TEXT CHECK (state IN ('open','investigating','escalated','mitigated','closed','false_positive')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Investigations (analyst notes)
CREATE TABLE IF NOT EXISTS investigations (
  id SERIAL PRIMARY KEY,
  incident_id INT REFERENCES incidents(id),
  analyst_id TEXT,
  notes TEXT,
  sla_deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Audit Logs (immutable)
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  actor TEXT,
  action TEXT,
  resource TEXT,
  details JSONB,
  ts TIMESTAMP DEFAULT now(),
  hash TEXT NOT NULL,
  prev_hash TEXT
);

-- Risk Scores (daily aggregates)
CREATE TABLE IF NOT EXISTS risk_scores (
  id SERIAL PRIMARY KEY,
  day DATE NOT NULL,
  avg_score NUMERIC,
  max_score NUMERIC,
  min_score NUMERIC
);
