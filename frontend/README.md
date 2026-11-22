# Developer Station 25 Invoice

Responsive React + TypeScript invoice maker based on the provided design.

## Run locally

```sh
npm install
npm run dev
```

## Invoice flow and data

The home page links to the invoice form and saved invoice list. Eight demo
invoices are loaded by `src/services/invoiceService.ts`; newly created invoices
are saved in browser local storage for this frontend-only version.

Invoice screens consume the `Invoice` type from `src/types/invoice.ts` through
the `InvoiceService` interface. To connect a backend later, replace the local
storage implementation with HTTP methods that map backend responses to
`Invoice`. The UI does not need to know where the data comes from.

Invoice previews use A4 sizing. **Download PDF** generates and downloads an A4
PDF directly in the browser.
