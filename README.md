# Bitespeed Backend Task: Identity Reconciliation

A web service for FluxKart.com to reconcile customer identities, built for the Bitespeed Backend Task. This API links customer orders using email or phone number, managing primary and secondary contact associations for a unified customer view.

---

## Our Approach

To solve the challenge of tracking customer identities across multiple purchases, we implemented:

- **Database Design:**  
    - PostgreSQL with a `Contact` table:  
        - `id`, `phoneNumber`, `email`, `linkedId`, `linkPrecedence` (primary/secondary), timestamps  
        - The oldest contact is primary; others are secondary if they share email or phone

- **Endpoint Development:**  
    - `/identify` POST endpoint using Node.js, TypeScript, Express  
    - Processes contact data, consolidates or creates contacts, and links them efficiently

- **Logic Implementation:**  
    - Matches incoming `email` or `phoneNumber` against existing contacts  
    - Merges duplicates, retaining the oldest as primary  
    - Creates new primary contacts for unmatched data  
    - Handles edge cases (e.g., multiple primaries) by reassigning the oldest as primary

- **Deployment:**  
    - Hosted on Render with PostgreSQL for scalability and reliability

- **Testing:**  
    - Test cases for new contacts, merges, and error handling

---

## Live Project

- **Base URL:**  
    [https://bitespeed-backend-kr28.onrender.com](https://bitespeed-backend-kr28.onrender.com)

---

## API Endpoint

- **URL:** `/identify`
- **Method:** `POST`
- **Content-Type:** `application/json`

### Request Example

```json
{
    "email": "marty@example.com",
    "phoneNumber": "1234567890"
}
```

### Response Examples

**New Contact**
```json
{
    "contact": {
        "primaryContactId": 1,
        "emails": ["marty@example.com"],
        "phoneNumbers": ["1234567890"],
        "secondaryContactIds": []
    }
}
```

**Merged Contact**
```json
{
    "contact": {
        "primaryContactId": 4,
        "emails": ["biff@example.com"],
        "phoneNumbers": ["5555555555"],
        "secondaryContactIds": [5]
    }
}
```

**Error**
```json
{
    "error": "At least one of email or phoneNumber must be provided"
}
```

---

## How to Test

### Prerequisites

- Postman or any HTTP client

### Steps

1. Send a `POST` request to  
     `https://bitespeed-backend-kr28.onrender.com/identify`  
     with `Content-Type: application/json`

2. **Test Cases:**
     - **New Contact:**  
         `{ "email": "test1@example.com", "phoneNumber": "9876543210" }`  
         _→ Expect a new `primaryContactId`_
     - **Merge:**  
         `{ "email": "test1@example.com", "phoneNumber": "5555555555" }`  
         _→ Expect merged contact with secondary ID_
     - **Empty:**  
         `{}`  
         _→ Expect error response_

3. **Verify:**  
     Check the Render PostgreSQL database:
     ```sh
     psql $DATABASE_URL
     \c bitespeed_db
     SELECT * FROM "Contacts";
     ```

---

## Setup

1. **Prerequisites:**  
     - Node.js 20.17.0  
     - PostgreSQL  
     - npm

2. **Install:**  
     ```sh
     git clone https://github.com/sharad-mishra/bitespeed-backend.git
     cd bitespeed-backend
     npm install
     ```

3. **Configure:**  
     - Set `.env` with `DATABASE_URL` and `NODE_ENV=development`

4. **Run:**  
     ```sh
     npm run migrate
     npm start
     ```

---

## Stack

- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL
- **Deployment:** Render

---

## Contributing

- Fork, create a branch (`git checkout -b feature-name`), commit, push, and open a PR.

---

## License

ISC License (add LICENSE file if needed).

---

## Acknowledgements

- Built for the Bitespeed Backend Task
- Thanks to Render for hosting

