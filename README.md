# MMMUT Placement API

A lightweight REST API built with [Express.js](https://expressjs.com/) to serve the placement and academic data of **Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur**.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher

### Installation

```bash
npm install
```

### Running the server

```bash
npm start
```

The API starts on **http://localhost:3000** by default.  
Set the `PORT` environment variable to use a different port.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API overview with all available endpoints |
| GET | `/university` | University information, contact details and rankings |
| GET | `/programs` | All academic programs (UG + PG) |
| GET | `/programs/ug` | Undergraduate programs (B.Tech, BBA, B.Pharm) |
| GET | `/programs/pg` | Postgraduate programs (M.Tech, MBA, MCA, M.Sc, Ph.D) |
| GET | `/placements/summary` | Year-wise placement summary (2016-17 to 2024-25) |
| GET | `/placements/sessions` | List of all sessions and sessions with detailed data |
| GET | `/placements/:session` | Full placement details for a session (e.g. `2021-22`, `2022-23`) |
| GET | `/placements/:session/branches` | Branch-wise placement totals for a session |
| GET | `/placements/:session/companies` | Company-wise placement details for a session |
| GET | `/achievements` | All notable student and team achievements |
| GET | `/achievements?session=<session>` | Achievements filtered by session (e.g. `?session=2022-23`) |
| GET | `/achievements/top-packages` | All-time top package records |
| GET | `/recruiters` | Past recruiters categorised by domain |
| GET | `/recruiters?category=<category>` | Recruiters for a specific category (e.g. `?category=IT_Software`) |
| GET | `/alumni` | Prominent alumni |
| GET | `/all` | Complete master dataset |

### Recruiter categories

| Category | Description |
|----------|-------------|
| `IT_Software` | IT / Software companies |
| `Core_Engineering` | Core engineering companies |
| `Banking_Finance` | Banking & finance companies |
| `Sales_Marketing_Education` | Sales, marketing and education sector |
| `Telecom_Others` | Telecom and other sectors |

---

## Data Sources

All data is sourced from the official MMMUT Training & Placement Cell publications:

- Placement Brochure 2023-24
- Placement Brochure 2022-23
- Placement Report 2021-22 (Detailed)
- Placement Report 2022-23 (Detailed)
- Placement Brochure 2025-26

---

## Testing

```bash
npm test
```

---

## Contact

**MMMUT Training & Placement Cell**  
Email: tnp@mmmut.ac.in  
Website: https://tnpmmmut.tech/
