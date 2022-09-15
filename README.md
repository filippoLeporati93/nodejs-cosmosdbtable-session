# ExpressJS Session Store for Azure Cosmos DB Table

Node.js express session store provider for Azure Cosmos DB table.

**Table of contents:**


* [Quickstart](#quickstart)
  * [Installing the client library](#installing-the-client-library)
  * [Using the client library](#using-the-client-library)
* [Supported Node.js Versions](#supported-nodejs-versions)
* [Versioning](#versioning)

## Quickstart

### Installing the client library

```bash
npm install nodejs-cosmosdbtable-session
```
    

### Using the client library

```javascript
const { TableClient, AzureNamedKeyCredential } = require('@azure/data-tables');
const express = require('express');
const session = require('express-session');
const app = express();

const { CosmosDbTableStore } = require('nodejs-cosmosdbtable-session');

const tableName = `SessionTable`;

// See authenticationMethods of @azure/data-tables for other options of creating a new client
let options: TableServiceClientOptions = {};
const client = TableClient.fromConnectionString(env.ACCOUNT_CONNECTION_STRING, tableName, options);

app.use(
  session({
    store: new CosmosDbTableStore({
      tableClient: client,
    }),
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', (req, res) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  const views = req.session.views++;
  res.send(`Views ${views}`);
});

app.listen(4830, () => {
  console.log('Example app listening on port 4830!');
});

```

## Supported Node.js Versions

Our client libraries follow the [Node.js release schedule](https://nodejs.org/en/about/releases/).
Libraries are compatible with all current _active_ and _maintenance_ versions of
Node.js.
If you are using an end-of-life version of Node.js, we recommend that you update
as soon as possible to an actively supported LTS version.

## Versioning

This library follows [Semantic Versioning](http://semver.org/).



This library is considered to be **stable**. The code surface will not change in backwards-incompatible ways
unless absolutely necessary (e.g. because of critical security issues) or with
an extensive deprecation period. Issues and requests against **stable** libraries
are addressed with the highest priority.

