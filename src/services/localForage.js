import * as localforage from "localforage";

localforage.config({
    driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name: 'galla_product_db',
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: 'galla_app_table', // Should be alphanumeric, with underscores.
    description: 'some description'
});

export default localforage;