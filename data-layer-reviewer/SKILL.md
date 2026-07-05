---
name: data-layer-reviewer
description: Review data layer code for pattern compliance, security, and best practices. Use when writing or reviewing data services in src/services/data/*. Triggers on "review data layer", "check data service", "data layer patterns".
allowed-tools: Read, Write
---

# Data Layer Reviewer

Review data layer code in `src/services/data/*` for pattern compliance, security issues, and best practices.

Use when:

- Writing new data services
- Reviewing PRs that touch data layer code
- Auditing existing data services for compliance

Triggers: "review data layer", "check data service", "data layer patterns"

## Review Checklist

Run through this checklist when reviewing data layer code:

### Structure

- [ ] File is in `src/services/data/{service-name}/`
- [ ] Has `index.ts`, `errors.ts`, `ServiceContext.ts`, `package.json`
- [ ] Uses section comments: `// --- Constants ---`, `// Private Functions`, etc.
- [ ] Exports a single `getService` function that returns an object of functions

### Constants & Enums

- [ ] `tableCode` defined for SQL aliases
- [ ] `defaultPageSize` set (typically 50)
- [ ] `ColumnsEnum` uses `Schema.enum()`
- [ ] `fullColumnNames` maps columns to `sql.identifier()`
- [ ] `defaultExcludes` for heavy columns (activityLog, data, etc.)
- [ ] `SortEnum` defined for valid sort options

### Permissions

- [ ] All public functions take `token: InternalToken` as first/second arg
- [ ] `hasPermission()` wrapper exists and is used
- [ ] `getPermittedIds()` wrapper exists and is used
- [ ] All queries JOIN on `(${permittedIds}) AS p`
- [ ] No direct table access without permission filtering
- [ ] `allowUnrestricted` option supported where needed

### SQL Patterns

- [ ] All queries use `sql.fragment` or `sql.type()` - NO string concatenation
- [ ] Parameters use `${value}` interpolation, never string concat
- [ ] Column identifiers use `sql.identifier([tableCode, 'column'])`
- [ ] Arrays use `sql.array(values, 'type')`
- [ ] JSON uses `sql.jsonb(object)`
- [ ] Filter functions return `true` when no filter (not empty fragment)

### Data Transformation

- [ ] `fromDb()` function exists for DB→API transform
- [ ] `fromDbAll()` for batch transforms using `allPromises()`
- [ ] All IDs encoded with `hashId.encodeXxxId()`
- [ ] Permissions converted via `asResourceActions()`
- [ ] Null values normalized appropriately

### Error Handling

- [ ] `errors.ts` exists with `createErrorCode()` and `createError()`
- [ ] Error codes use SCREAMING_SNAKE_CASE
- [ ] Common errors defined: `notFound`, `invalidCreate`, `invalidUpdate`
- [ ] `notFound` has `statusCode: 404`
- [ ] Errors thrown directly, not wrapped in new Error()

### Security

- [ ] No raw SQL string concatenation
- [ ] Email comparisons use `LOWER()` on both sides
- [ ] IDs decoded before use in queries
- [ ] Transactions used for multi-step operations
- [ ] `removeAll` only works for test orgs (check `test: true`)

### Exports

```typescript
// Expected exports from getService():
return {
  getAllIds, // Required for listing
  getAll, // Required for listing with data
  getCount, // Optional
  getById, // Required
  exists, // Optional
  create, // Required for writable resources
  update, // Required for writable resources
  archiveAll, // Optional
  restoreAll, // Optional
  removeAll, // Optional (test orgs only)
  errorCode, // Required
  errors, // Required
  columnsEnum, // Required
  ShowEnum, // Required
  sortEnum, // Required
};
```

## Common Issues

### Missing Permission Check

```typescript
// BAD
async function getById(id: string) {
  return await postgres.first(sql.fragment`SELECT * FROM t WHERE id = ${id}`);
}

// GOOD
async function getById(token: InternalToken, id: string, options = {}) {
  const permittedIds = await getPermittedIds(
    context,
    token,
    ActionTypesEnum.view,
    options,
  );
  return await postgres.first(sql.fragment`
    SELECT * FROM t INNER JOIN (${permittedIds}) AS p ON p.id = t.id
    WHERE t.id = ${decodedId}`);
}
```

### Exposed Internal ID

```typescript
// BAD
return { id: result.id };

// GOOD
return { id: await hashId.encodeResourceId(result.id) };
```

### Case-Sensitive Email

```typescript
// BAD
sql.fragment`email = ${email}`;

// GOOD
sql.fragment`LOWER(email) = LOWER(${email})`;
```

### SQL Injection Risk

```typescript
// BAD
const query = `SELECT * FROM t WHERE name = '${name}'`;

// GOOD
const query = sql.fragment`SELECT * FROM t WHERE name = ${name}`;
```

### Missing Transaction

```typescript
// BAD - partial failure leaves inconsistent state
await postgres.execute(sql.fragment`INSERT INTO a ...`);
await postgres.execute(sql.fragment`INSERT INTO b ...`);

// GOOD
await postgres.withTransaction(async (transaction) => {
  await transaction.execute(sql.fragment`INSERT INTO a ...`);
  await transaction.execute(sql.fragment`INSERT INTO b ...`);
});
```

## Reference Documentation

See `docs/DataLayerPatterns.md` for comprehensive patterns and examples.
