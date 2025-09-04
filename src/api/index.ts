import * as products from './products';
import * as sales from './sales';
import * as dashboard from './dashboard'
import * as auth from './auth'
import * as users from './users'

class API {
  products: typeof products;
  sales: typeof sales;
  dashboard: typeof dashboard;
  auth: typeof auth;
  users: typeof users;

  constructor() {
    this.products = products;
    this.sales = sales;
    this.dashboard = dashboard;
    this.auth = auth;
    this.users = users;
  }
}

const api = new API();

export default api;
