---
Title: JSRamverk
Description: Documentation of choice of path at crossroads in project.
---

# SSR Editor
# Challe_P and narwhal

Starter project for DV1677 JSRamverk
# jsramverk

# How to boot app.mjs

If you encounter a missing dotenv package error such as
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'dotenv' imported
```

install the package using npm:

```
npm install --save dotenv
```

To run app.mjs, use

```
node app.mjs
```

You may set the preferred port of the system using `export PORT=XXXX`.
If the port is not set in the `dotenv` of the system, the app will run
on port 1338.


To initialize/reset database use

```
bash db/reset_db.bash
```

# Framework

We will use either Angular or React as a JS framework.
