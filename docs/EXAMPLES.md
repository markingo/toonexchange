# Example Datasets for TOON Calculator

Try these example datasets to see TOON's token savings in action!

## Example 1: User Management (Simple)

**JSON** (87 tokens)
```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin", "active": true },
    { "id": 2, "name": "Bob", "role": "user", "active": true },
    { "id": 3, "name": "Charlie", "role": "user", "active": false }
  ]
}
```

**TOON** (52 tokens) - **40% savings**
```toon
users[3]{id,name,role,active}:
  1,Alice,admin,true
  2,Bob,user,true
  3,Charlie,user,false
```

---

## Example 2: E-commerce Orders (Medium)

**JSON** (245 tokens)
```json
{
  "orders": [
    {
      "orderId": "ORD-001",
      "customerId": 1234,
      "total": 99.99,
      "status": "shipped",
      "items": 3
    },
    {
      "orderId": "ORD-002",
      "customerId": 5678,
      "total": 149.50,
      "status": "processing",
      "items": 5
    },
    {
      "orderId": "ORD-003",
      "customerId": 9012,
      "total": 75.25,
      "status": "delivered",
      "items": 2
    },
    {
      "orderId": "ORD-004",
      "customerId": 3456,
      "total": 299.99,
      "status": "shipped",
      "items": 8
    }
  ]
}
```

**TOON** (137 tokens) - **44% savings**
```toon
orders[4]{orderId,customerId,total,status,items}:
  ORD-001,1234,99.99,shipped,3
  ORD-002,5678,149.5,processing,5
  ORD-003,9012,75.25,delivered,2
  ORD-004,3456,299.99,shipped,8
```

---

## Example 3: Analytics Data (Large)

**JSON** (412 tokens)
```json
{
  "metrics": [
    {
      "date": "2025-01-01",
      "pageViews": 1250,
      "uniqueVisitors": 890,
      "bounceRate": 45.2,
      "avgSessionDuration": 185
    },
    {
      "date": "2025-01-02",
      "pageViews": 1340,
      "uniqueVisitors": 920,
      "bounceRate": 43.8,
      "avgSessionDuration": 192
    },
    {
      "date": "2025-01-03",
      "pageViews": 1180,
      "uniqueVisitors": 850,
      "bounceRate": 47.5,
      "avgSessionDuration": 178
    },
    {
      "date": "2025-01-04",
      "pageViews": 1420,
      "uniqueVisitors": 980,
      "bounceRate": 41.2,
      "avgSessionDuration": 205
    },
    {
      "date": "2025-01-05",
      "pageViews": 1560,
      "uniqueVisitors": 1050,
      "bounceRate": 39.8,
      "avgSessionDuration": 218
    }
  ]
}
```

**TOON** (198 tokens) - **52% savings**
```toon
metrics[5]{date,pageViews,uniqueVisitors,bounceRate,avgSessionDuration}:
  2025-01-01,1250,890,45.2,185
  2025-01-02,1340,920,43.8,192
  2025-01-03,1180,850,47.5,178
  2025-01-04,1420,980,41.2,205
  2025-01-05,1560,1050,39.8,218
```

---

## Example 4: Product Catalog (Complex)

**JSON** (328 tokens)
```json
{
  "products": [
    {
      "sku": "WIDGET-001",
      "name": "Premium Widget",
      "price": 29.99,
      "stock": 150,
      "category": "widgets"
    },
    {
      "sku": "GADGET-042",
      "name": "Smart Gadget Pro",
      "price": 89.99,
      "stock": 75,
      "category": "gadgets"
    },
    {
      "sku": "TOOL-123",
      "name": "Universal Tool",
      "price": 45.50,
      "stock": 200,
      "category": "tools"
    },
    {
      "sku": "DEVICE-999",
      "name": "Compact Device",
      "price": 199.99,
      "stock": 30,
      "category": "devices"
    },
    {
      "sku": "WIDGET-002",
      "name": "Basic Widget",
      "price": 14.99,
      "stock": 500,
      "category": "widgets"
    }
  ]
}
```

**TOON** (175 tokens) - **47% savings**
```toon
products[5]{sku,name,price,stock,category}:
  WIDGET-001,"Premium Widget",29.99,150,widgets
  GADGET-042,"Smart Gadget Pro",89.99,75,gadgets
  TOOL-123,"Universal Tool",45.5,200,tools
  DEVICE-999,"Compact Device",199.99,30,devices
  WIDGET-002,"Basic Widget",14.99,500,widgets
```

---

## Example 5: API Response (Real-world)

**JSON** (567 tokens)
```json
{
  "status": "success",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "users": [
      {
        "userId": 1001,
        "username": "alice_dev",
        "email": "alice@example.com",
        "role": "developer",
        "lastLogin": "2025-01-15T09:15:00Z",
        "active": true
      },
      {
        "userId": 1002,
        "username": "bob_admin",
        "email": "bob@example.com",
        "role": "admin",
        "lastLogin": "2025-01-15T08:45:00Z",
        "active": true
      },
      {
        "userId": 1003,
        "username": "charlie_user",
        "email": "charlie@example.com",
        "role": "user",
        "lastLogin": "2025-01-14T16:30:00Z",
        "active": false
      }
    ]
  },
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 3
  }
}
```

**TOON** (285 tokens) - **50% savings**
```toon
status: success
timestamp: "2025-01-15T10:30:00Z"
data:
  users[3]{userId,username,email,role,lastLogin,active}:
    1001,alice_dev,alice@example.com,developer,2025-01-15T09:15:00Z,true
    1002,bob_admin,bob@example.com,admin,2025-01-15T08:45:00Z,true
    1003,charlie_user,charlie@example.com,user,2025-01-14T16:30:00Z,false
pagination:
  page: 1
  perPage: 10
  total: 3
```

---

## Token Savings Summary

| Example | JSON Tokens | TOON Tokens | Saved | Savings % |
|---------|-------------|-------------|-------|-----------|
| User Management | 87 | 52 | 35 | 40% |
| E-commerce Orders | 245 | 137 | 108 | 44% |
| Analytics Data | 412 | 198 | 214 | 52% |
| Product Catalog | 328 | 175 | 153 | 47% |
| API Response | 567 | 285 | 282 | 50% |

**Average Savings: 46.6%**

---

## Tips for Maximum Savings

1. **Uniform Arrays**: TOON excels with arrays of objects that have the same fields
2. **Primitive Values**: Best for strings, numbers, booleans (not nested objects)
3. **Large Datasets**: Savings increase with more rows (fixed header overhead)
4. **Consistent Structure**: Same field order and types across all rows
5. **Avoid Nesting**: Deeply nested structures may not benefit as much

## When to Use TOON

✅ **Good for:**
- Database query results
- API responses with tabular data
- Analytics and metrics
- User lists, product catalogs
- Log entries, event streams

❌ **Not ideal for:**
- Deeply nested hierarchies
- Objects with varying fields
- Single objects (no array)
- Mixed data types in arrays
- Sparse data with many nulls

---

**Try these examples in the calculator to see the savings yourself!**

