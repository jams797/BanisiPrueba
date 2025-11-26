-- ============================================
--  CATÁLOGOS
-- ============================================

-- Estados de la solicitud de préstamo
CREATE TABLE loan_application_statuses (
  code        VARCHAR(50) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order  INT,
  is_final    BOOLEAN NOT NULL DEFAULT FALSE
);

-- Decisión automática (motor de scoring)
CREATE TABLE loan_auto_decisions (
  code        VARCHAR(50) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT
);

-- Decisión manual del analista/oficial de crédito
CREATE TABLE loan_manual_decisions (
  code        VARCHAR(50) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT
);

-- ============================================
--  RESUMEN DE HISTORIAL CREDITICIO POR PERSONA
--  (SIMULA LA RESPUESTA DEL BURÓ)
-- ============================================

CREATE TABLE credit_history_summary (
  id                      BIGSERIAL PRIMARY KEY,
  document_number         VARCHAR(30) NOT NULL UNIQUE,

  -- Métricas resumidas
  total_open_accounts     INT             NOT NULL DEFAULT 0,
  total_current_balance   NUMERIC(15,2)   NOT NULL DEFAULT 0,
  max_days_past_due       INT             NOT NULL DEFAULT 0,

  -- Clasificación general (para usar en el score)
  credit_history_level    VARCHAR(50),

  last_bureau_update_at   TIMESTAMPTZ,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
--  TABLA PRINCIPAL DE SOLICITUDES DE PRÉSTAMO
-- ============================================

CREATE TABLE loan_applications (
  id                   BIGSERIAL PRIMARY KEY,

  -- Datos del cliente
  document_number      VARCHAR(30) NOT NULL,
  full_name            VARCHAR(200) NOT NULL,
  email                VARCHAR(200) NOT NULL,
  phone_number         VARCHAR(30),

  -- Datos del préstamo solicitado
  requested_amount     NUMERIC(15,2) NOT NULL,
  term_months          INT NOT NULL,
  purpose              TEXT,

  -- Variables internas para el análisis de score
  monthly_income       NUMERIC(15,2),
  monthly_expenses     NUMERIC(15,2),

  -- Resultado de scoring
  point_score           NUMERIC(5,2),

  automatic_decision_code VARCHAR(50),
  manual_decision_code    VARCHAR(50) NOT NULL DEFAULT 'pending',

  -- Estado general del workflow
  status_code          VARCHAR(50) NOT NULL DEFAULT 'submitted',

  -- Trazabilidad
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at         TIMESTAMPTZ,
  auto_decided_at      TIMESTAMPTZ,
  manually_decided_at  TIMESTAMPTZ,
  created_by           VARCHAR(100),
  updated_by           VARCHAR(100),

  -- FKs
  CONSTRAINT fk_loan_app_status
    FOREIGN KEY (status_code) REFERENCES loan_application_statuses(code),

  CONSTRAINT fk_loan_app_auto_decision
    FOREIGN KEY (automatic_decision_code) REFERENCES loan_auto_decisions(code),

  CONSTRAINT fk_loan_app_manual_decision
    FOREIGN KEY (manual_decision_code) REFERENCES loan_manual_decisions(code)
);

-- ============================================
--  TABLA USUARIOS
-- ============================================

CREATE TABLE users (
  id                   BIGSERIAL PRIMARY KEY,

  full_name            VARCHAR(200) NOT NULL,
  email                VARCHAR(200) NOT NULL,
  pass                 VARCHAR(500) NOT NULL,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
--  FUNCIÓN GENÉRICA PARA updated_at
-- ============================================

CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para loan_applications
CREATE TRIGGER trg_loan_applications_set_timestamp
BEFORE UPDATE ON loan_applications
FOR EACH ROW
EXECUTE FUNCTION set_timestamp();

-- Trigger para credit_history_summary
CREATE TRIGGER trg_credit_history_summary_set_timestamp
BEFORE UPDATE ON credit_history_summary
FOR EACH ROW
EXECUTE FUNCTION set_timestamp();

-- ============================================
--  DATOS INICIALES DE CATÁLOGOS (OPCIONAL)
-- ============================================

INSERT INTO loan_application_statuses (code, name, description, sort_order, is_final) VALUES
  ('draft',      'Borrador',         'Solicitud en edición por el cliente',              1, FALSE),
  ('submitted',  'Enviada',          'Enviada por el cliente, pendiente de revisión',    2, FALSE),
  ('in_review',  'En revisión',      'En análisis por el motor o analista',              3, FALSE),
  ('approved',   'Aprobada',         'Aprobada para desembolso',                         4, TRUE),
  ('rejected',   'Rechazada',        'Rechazada por políticas o score',                  5, TRUE),
  ('disbursed',  'Desembolsada',     'Préstamo desembolsado al cliente',                 6, TRUE),
  ('cancelled',  'Cancelada',        'Cancelada por el cliente o el banco',              7, TRUE);

INSERT INTO loan_auto_decisions (code, name, description) VALUES
  ('approved',       'Aprobado automático',        'Cumple parámetros para aprobación directa'),
  ('rejected',       'Rechazado automático',       'No cumple políticas mínimas'),
  ('manual_review',  'Revisión manual requerida',  'Requiere evaluación de un analista');

INSERT INTO loan_manual_decisions (code, name, description) VALUES
  ('pending',   'Pendiente', 'Aún no revisado por oficial de crédito'),
  ('approved',  'Aprobado',  'Aprobado por oficial de crédito'),
  ('rejected',  'Rechazado', 'Rechazado por oficial de crédito');

INSERT INTO users (full_name, email, pass) VALUES
  ('José Morán',   'jmoran@viamatica.com', '$2b$10$adOv505cKlS1XpYZuHG/6ORse5izbgP5IpG/F2gT7jFHtxxAJPgBy');

INSERT INTO credit_history_summary  (document_number, total_open_accounts, total_current_balance, max_days_past_due, credit_history_level, last_bureau_update_at) VALUES
  ('0000000001', 3, 23000, 2,  'good', now()),
  ('0000000002', 1, 2000,  30, 'good', now()),
  ('0000000003', 1, 1000,  2,  'poor', now()),
  ('0000000004', 1, 100,   20, 'good', now());
