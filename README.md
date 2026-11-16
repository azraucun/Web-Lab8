# Assignment 8 — My First Back-End
 
A small Express 5 server (ES modules) for a made-up study programme. It serves a web page, offers a few API routes, logs every request and counts them.
 
Author: Azra Ucun
 
## Install and run
 
```bash
git clone https://github.com/azraucun/Web-Lab8.git
cd Web-Lab8
npm install
npm start          # node server.js
npm run dev        # node --watch server.js (auto restart)
```
 
The port comes from `process.env.PORT` (fallback `3000`), e.g. `PORT=4000 npm start`. Open http://localhost:3000.
 
## File organization
 
```
/Web-Lab8
 ├─ public/          index.html, styles.css, app.js (served by express.static)
 ├─ server.js        data, middleware, routes, 404 fallback
 ├─ package.json     "type": "module", start/dev scripts
 ├─ package-lock.json
 ├─ .gitignore       node_modules/, .env
 └─ README.md
```
 
## Middleware order and counting
 
Order in `server.js`: **logger → counter → `express.static` → routes → 404 fallback**.
 
Express runs handlers in the order they are registered, and the first one that sends a response ends the chain. The logger and counter come first so they see every request; the 404 fallback comes last because it matches everything.
 
**Counted requests:** every request that reaches the server, including static files, `/favicon.ico`, 404s and the `/api/stats` request itself (so the first call returns `1`). The value is called `requestsServed`, and the server answers all of these. The counter lives in memory and resets when the server restarts.
 
## Testing evidence (`curl --include`)
 
```
$ curl --include http://localhost:3000/api/courses
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 219
ETag: W/"db-daw0k0mqBOj7P3JPluYnPyI7akE"
Date: Mon, 16 Nov 2026 16:06:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
 
[{"id":1,"title":"Introduction to Web Programming","credits":6},{"id":2,"title":"Databases","credits":5},{"id":3,"title":"Algorithms and Data Structures","credits":6},{"id":4,"title":"Software Engineering","credits":4}]
```
 
```
$ curl --include -X POST http://localhost:3000/api/subscribe
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Mon, 16 Nov 2026 16:06:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
 
{"subscribed":true}
```
 
```
$ curl --include http://localhost:3000/api/admin
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-TLNzmZqKxaTuFdX/dVWWPBu44/c"
Date: Mon, 16 Nov 2026 16:06:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
 
{"error":"Forbidden"}
```
 
```
$ curl --include http://localhost:3000/old-page
HTTP/1.1 302 Found
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Date: Mon, 16 Nov 2026 16:06:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
 
Found. Redirecting to /hello
```
 
```
$ curl --include http://localhost:3000/api/does-not-exist
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-bm7tJgu8FHlq5QU+Y6gDxOGPfRc"
Date: Mon, 16 Nov 2026 16:06:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
 
{"error":"Not found"}
```
 
```
$ curl --include http://localhost:3000/does-not-exist
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 31
ETag: W/"1f-k0TCbjVa+pfRfed7TWNOJ0tisV0"
Date: Mon, 16 Nov 2026 16:06:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
 
Page not found: /does-not-exist
```
 
## Reasoning questions
 
**1. Route order.** With the 404 fallback at the top, every request returned 404, even `/hello`. Express checks handlers in order, and the fallback matches everything, so it answered first and the real routes were never reached.
 
**2. Middleware.** Without `next()` in the logger, the browser kept loading forever, while the server still printed the log line. The logger ran, but it neither passed control on nor sent a response, so the request was left hanging.
 
**3. Status codes.** `201` tells the client that something new was created, which is more precise than `200`. A missing page must be `404` because browsers, `fetch` and search engines read the status code, not the message; with `200` they would treat the error as a real page.
 
**4. Configuration.** Hosting services choose the port and pass it in `PORT`, and port 3000 might already be in use. Reading `process.env.PORT` lets the same code run anywhere without changes.
 
**5. Dependencies.** `node_modules` is large and can be rebuilt from `package.json` and `package-lock.json`. After cloning, a teammate only runs `npm install` and then `npm start`.
 
**6. Same origin.** Opened from disk (`file://`), the buttons showed "Network error", because `/api/courses` became `file:///api/courses`. Even with a full URL the page and server would have different origins, and the browser blocks this without CORS headers. This is the **Same-Origin Policy**.
 
## Self-study notes
 
- `process.version` and `process.uptime()` (Node docs) give real values for `/api/status`.
- `res.type('text/plain')` sets the content type; `res.send` alone defaults to `text/html`.
- `JSON.stringify(data, null, 2)` pretty-prints JSON in the `<pre>` element.
- `fetch` does not throw on 403/404, so `app.js` checks `response.ok` and uses `try/catch` only for network errors.
- `path.join(import.meta.dirname, 'public')` makes the server work from any folder.
- Express 5 rejects `app.get('*')`, so the fallback is `app.use((req, res) => ...)`.
## Challenges
 
- `npm install` went to a parent folder because I had not run `npm init` yet.
- `npm init` set `"type": "commonjs"`, which I changed to `"module"`.
- `/api/stats` returned 404 because the route was missing; it showed me the fallback works.
 