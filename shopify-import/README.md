# Shopify test products import

CSV products match this app’s Storefront queries and `mapProduct` rules:

| Requirement | CSV value |
|-------------|-----------|
| Collection | Add imported products to manual collection handle **`books`** (or set `VITE_SHOPIFY_BOOKS_COLLECTION`) |
| Format option | **`Option1 Name`** = `Format` |
| Physical variant | **`Option1 Value`** = `Physical` (requires shipping) |
| E-book variant | **`Option1 Value`** = `E-book` (no shipping) |
| Published | `TRUE` / `active` |
| Tags | `book, books` (optional; collection is what the API uses) |

## Products included

| Handle | Title | Physical | E-book |
|--------|-------|----------|--------|
| `az-ejfeli-kert` | Az éjféli kert | 4990 | 2990 |
| `budapesti-tortenetek` | Budapesti történetek | 5990 | 3490 |
| `programozas-kezdoknek` | Programozás kezdőknek | 6990 | 3990 |

Prices use your store’s **default currency** (Shopify converts the number only; HUF store → HUF, USD store → USD).

Detail URLs: `/books/az-ejfeli-kert`, etc.

## Import steps

1. **Remove demo clutter** (optional): In Admin, remove snowboards/sample items from the **`books`** collection (or delete them).
2. **Import products**: **Products → Import** → choose `products.csv` → upload → confirm mapping (Option1 → Format) → start import.
3. **Import inventory** (after products exist): see [Inventory import](#inventory-import) below.
4. **Assign collection**: **Products → Collections → `books`** (create if missing; handle must be `books`) → add the three imported products.
5. **Sales channel**: Ensure products are available on **Online Store**.
6. **Shipping** (physical only): **Settings → Shipping** — at least one rate for your market (e-book variants do not require shipping).
7. **Restart dev app** if needed: `npm run dev` — open `/books` and test **Vásárlás** on each format.

## Inventory import

Use **`inventory.csv`** after `products.csv` has been imported (SKUs must already exist on the variants).

| File | Purpose |
|------|---------|
| `inventory.csv` | Set stock per variant at your primary location |

**Steps**

1. **Products → Inventory → Import** (or **Inventory → Import** depending on Admin version).
2. Upload `inventory.csv`.
3. If Shopify rejects the file, export your current inventory once (**Export**), open that CSV, and copy the exact **`Location`** name and **all column headers** into `inventory.csv` (Shopify requires the full header row, including empty `Option2` / `Option3` columns).
4. Leave **`On hand (current)`**, **`Available`**, **`Committed`**, etc. empty on import — only fill **`On hand (new)`**.
5. Default location in the template is **`Budapest Warehouse`** — change to match your store if needed.

**Quantities in the template**

| Variant type | On hand (new) | Notes |
|--------------|---------------|--------|
| Physical | 20–30 | Sellable print stock |
| E-book | 999 | High stock for digital SKUs |

**Enable tracking** (if variants show “Inventory not tracked”): edit each product in Admin → **Physical** variant → **Inventory tracked** → save, then re-import `inventory.csv`. Or add to `products.csv` before product import: `Variant Inventory Tracker` = `shopify` and `Variant Inventory Qty` = `0`, then use `inventory.csv` to set real counts.

## Verify in the app

- Catalog shows titles and **non-zero** prices (default variant price).
- Detail page shows two radios: **Nyomtatott** and **E-könyv**.
- **Vásárlás** enabled for both when `availableForSale` is true in Shopify.
- Checkout uses Bogus Gateway test card `1` on dev stores.

## Still seeing the old catalog (Gatsby, snowboards)?

The app loads **only** products in the manual collection whose handle is **`books`** (see `VITE_SHOPIFY_BOOKS_COLLECTION`). It does **not** cache the list in the browser.

Checklist:

1. **Products →** search `az-ejfeli-kert` (or **Programozás kezdőknek**). If missing → re-import `products.csv`.
2. If products exist in Admin but not on the site → open each product → **Product status: Active** → **Publishing** → enable **Online Store** (and your headless channel if used).
3. **Products → Collections → `books`** → remove demo items → **Add products** → select the three Hungarian books → **Save**.
4. Hard-refresh the app (`Cmd+Shift+R`) or click **Újra** if the error banner is shown.

Until step 3 is done, the storefront API will keep returning the old collection members (e.g. `the-great-gatsby`, snowboard handles).

## Admin looks correct but the app still shows old products?

**Admin and the Storefront API use different “publication” rules.**  
Your screenshot can show the right books in the **`books`** collection while the API still returns Gatsby/snowboards because those are the only products published to your **custom app’s Storefront channel**.

### Fix: publish to your Storefront app channel

Do this for **each** new book **and** for the **`books` collection**:

1. Open the product (e.g. **Az éjféli kert**).
2. Top right → **Publishing** (or **Manage sales channels**).
3. Click **Manage** / **⋯** → enable the channel for the app that owns your Storefront token (often named like your custom app, **Headless**, or **Shopify GraphiQL App** — **not** only “Online Store”).
4. Repeat for all three books.
5. Open **Collections → books** → same **Publishing** section → enable that same channel for the collection.
6. Hard-refresh `http://localhost:5173/books`.

**Bulk option:** Products list → select all three → **Bulk edit** → **Columns** → sales channel / availability → enable your app channel.

**Verify:** In browser DevTools → Network → after reload, the Storefront GraphQL response for `collection(handle: "books")` should list handles `az-ejfeli-kert`, `budapesti-tortenetek`, `programozas-kezdoknek` — not `the-great-gatsby`.

| You fixed in Admin | Still needed for the React app |
|--------------------|--------------------------------|
| Products in `books` collection | Same |
| Active + Online Store | **Also** publish to Storefront/custom app channel |
| CSV import | Products exist (you have this) |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Products not on `/books` | Add to `books` collection; check `VITE_SHOPIFY_BOOKS_COLLECTION` |
| Old list after import | New products not in `books` collection, or not published to Online Store |
| Only one format / 0 price | Re-import; confirm **Option1 Name** is `Format`, values `Physical` / `E-book` |
| Buy disabled | Variant not available on Online Store; inventory/channel settings |
| Wrong language on books | Book copy comes from Shopify title/body (HU in CSV); UI labels stay Hungarian |

## Customizing

Edit `products.csv` in Excel or a text editor (UTF-8). Keep the two-row-per-product pattern: first row = product + Physical variant; second row = same **Handle**, empty title, **E-book** variant.
