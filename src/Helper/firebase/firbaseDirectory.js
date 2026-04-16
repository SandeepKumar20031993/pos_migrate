import StoreHelper from '../storeHelper'

export const storeCode = StoreHelper.getStoreCode();
//Catalog directories
export const catalog = storeCode + "/catalog";
export const product = catalog + "/product";


//Sales Directories
export const sales = storeCode + "/sales";
export const order = sales + "/order";