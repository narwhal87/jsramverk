---
Title: JSRamverk
Description: Documentation of choice of path at crossroads in project.
---

# SSR Editor
# Challe_P and narwhal

Starter project for DV1677 JSRamverk
# jsramverk

=======
How to boot app.mjs
=======

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

To initialize/reset database use

```
bash db/reset_db.bash
```

Our port was undefined, so we hardcoded `port = 1338;` into `app.mjs`.
