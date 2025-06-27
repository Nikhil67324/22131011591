# 22131011591


# URL Shortener Microservice

A robust backend microservice built using *Node.js, **Express, **MongoDB, and a custom reusable **Logging Middleware*. This project lets you shorten URLs, customize shortcodes, track click analytics, and retrieve stats — all with centralized logging for every event.

---

## Features

-  Create short URLs with custom or unique shortcodes
- Set expiration time (validity) for each short URL
- Click tracking (referrer, location/IP, timestamp)
- Redirection to original long URL
- Stats endpoint: total clicks, click details
- Shortcode uniqueness enforcement
- Robust logging middleware (API-based)
- Proper error handling with status codes and messages

---

## Tech Stack

- *Backend*: Node.js + Express
- *Database*: MongoDB + Mongoose
- *Logging*: Custom middleware (POSTs logs to test server)
- *Tools*: Thunder Client (for testing)

---

## INSTALLATION 

Install dependencies
- npm install

  Start server
-  npm start
