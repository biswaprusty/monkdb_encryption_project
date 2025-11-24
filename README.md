# 🛡️ **MonkDB Encryption Project**

A complete beginner-level implementation of **JavaScript-based hashing & HMAC encryption** inside **MonkDB** using:

* JS-based UDFs
* SQL migrations
* Node.js integration
* Automated tests (unit + integration)

This project demonstrates how MonkDB can use **JavaScript UDFs** to normalize numeric-like text and generate:

* **SHA-256 Hash**
* **HMAC-SHA256** (keyed encryption)

It also includes a safe folder structure, scripts for migrations, and example application code.

---

# 📁 **Project Structure Overview**

```
monkdb_encryption_project/
│
├── db/
│   ├── triggers.sql
│   └── udfs.sql
│
├── docs/
│   └── security-checklist.md
│
├── infra/db/
│   ├── 001_create_tables.sql
│   ├── 002_create_udfs.sql
│   └── 003_create_triggers.sql
│
├── node_modules/        # auto-generated
│
├── scripts/
│   ├── check_run.js     # test sample UDF execution
│   ├── migrate.js       # applies SQL migrations
│   └── run_tests.sh     # shell-based test runner
│
├── src/
│   ├── app/
│   │   ├── db-client.js     # pg client
│   │   └── encryptor.js     # JS wrapper for UDFs
│   │
│   ├── routes/
│   │   └── customers.js     # example API route
│   │
│   └── tests/
│       ├── integration/
│       │   └── db-insert.spec.js   # DB write tests
│       └── unit/
│           └── encryptor.spec.js   # local hash/hmac tests
│
├── .env.example
├── .env                     # NOT committed
├── package.json
└── README.md
```

---

# 🚀 **1. Setup Instructions**

## **1️⃣ Install project dependencies**

```bash
npm install
```

---

## **2️⃣ Create `.env`**

Copy template:

```bash
cp .env.example .env
```

Fill the values:

```
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=monk
PGPASSWORD=monk
PGDATABASE=monkdb

# HMAC secret key used inside UDF
HMAC_KEY_SECRET=local-dev-secret-key
```

### ⚠️ **Never commit `.env`**

It contains secrets.

---

# 🧰 **2. Running Migrations**

All SQL files inside `infra/db/` will run in natural order:

```bash
npm run migrate
```

This will apply:

* `001_create_tables.sql`
* `002_create_udfs.sql`
* `003_create_triggers.sql`

After this, MonkDB will have:

✔️ Tables
✔️ JavaScript UDFs
✔️ Auto-triggers
✔️ Demo dataset ready

---

# 🔐 **3. What This Project Implements**

## **A. normalize_and_sha256(input TEXT)**

A deterministic function that:

* Cleans the input
* Normalizes decimal formatting
* Removes thousand separators
* Extracts numeric part
* Generates **SHA-256 hex hash**

Used for:

* Deduplication
* Deterministic masking
* Privacy masking

---

## **B. normalize_and_hmac(input TEXT)**

Same normalization, but:

* Performs **HMAC-SHA256**
* Uses key from `.env` → `HMAC_KEY_SECRET`

Used for:

* Keyed hashing
* Authentication tokens
* Non-reversible masking

---

# 🔍 **4. Testing Encryptor UDFs**

## Run JavaScript test suite:

```bash
npm test
```

This will run:

* **Unit Tests**:
  `tests/unit/encryptor.spec.js`
  → Tests hashing/HMAC behavior locally in Node.

* **Integration Tests**:
  `tests/integration/db-insert.spec.js`
  → Inserts data into MonkDB and verifies UDF outputs.

---

## Quick UDF check:

```bash
npm run check
```

Expected sample output:

```
Input: "12,350.55"
Normalized: "12350.55"
SHA256: a93b3c...
HMAC: 2bc12d...
```

---

# 🧪 **Sample SQL Usage**

Insert:

```sql
INSERT INTO customers(raw_amount)
VALUES ('12,350.55');
```

Query:

```sql
SELECT 
  raw_amount,
  normalize_and_sha256(raw_amount) AS sha256_hash,
  normalize_and_hmac(raw_amount) AS hmac_hash
FROM customers;
```

---

# 📦 **5. Scripts Summary**

### 📌 `scripts/migrate.js`

Applies SQL migrations in correct order.

### 📌 `scripts/check_run.js`

Runs quick UDF test using SQL query.

### 📌 `scripts/run_tests.sh`

Shell script wrapper for unit + integration tests.

---

# 🔒 **6. Security Notes**

✔️ UDFs must be deterministic
✔️ HMAC key should come from vault in production
✔️ `.env` MUST be ignored
✔️ Triggers enforce automatic hashing
✔️ MonkDB authentication cannot create custom `create user` (intentionally restricted)

---

# 🌩️ **7. Production Recommendations**

For serious applications:

* Store `HMAC_KEY_SECRET` in:

  * AWS KMS
  * HashiCorp Vault
  * Azure Key Vault
  * GCP Secret Manager

* Use Docker Compose for containerized MonkDB

* Use migration runner in CI/CD

* Enforce RLS / access-control as needed

---

# ☁️ **8. GitHub Push Instructions**

After making sure `.env` is ignored:

```bash
git add .
git commit -m "Initial MonkDB Encryption Project"
git branch -M main
git push --set-upstream origin main
```

---

# 🏁 **9. Summary**

This project helps beginners understand:

✔️ How JS-based encryption works in MonkDB
✔️ How UDFs transform & hash data
✔️ How to run SQL migrations
✔️ How NodeJS interacts with MonkDB
✔️ How to build tests for encrypted workloads
