import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
// Inventory
import products from './modules/inventory/products'
import category from './modules/inventory/category'
import size from './modules/inventory/size'
import color from './modules/inventory/color'
import manufacture from './modules/inventory/manufacture'
import stock_adjustment from './modules/inventory/stock_adjustment'
import stock_transfer from './modules/inventory/stock_transfer'
import assembly from './modules/inventory/assembly'
// Purchase
import vendor from './modules/purchase/vendor'
import checkout from './modules/purchase/checkout'
import purchase from './modules/purchase/purchase'
import purchase_return from './modules/purchase/purchase_return'
import ap_payment from './modules/purchase/ap_payment'
import ap_cash from './modules/purchase/ap_cash'
// Sales
import customer from './modules/sales/customer'
// General Ledger
import classification from './modules/ledger/classification'
import controls from './modules/ledger/controls'
import balance from './modules/ledger/balance'
import account from './modules/ledger/account'
import ledger from './modules/ledger/ledger'
import journal from './modules/ledger/journal'
import financial from './modules/ledger/financial'


// Tansaction
import cashin from './modules/transaction/cashin'
import cashout from './modules/transaction/cashout'
import transfer from './modules/transaction/transfer'

// Setting
import tax from './modules/setting/tax'
import cost from './modules/setting/cost'
import branch from './modules/setting/branch'
import unit from './modules/setting/unit'
import bank from './modules/setting/bank'
import currency from './modules/setting/currency'
import payment from './modules/setting/payment'
import asset from './modules/setting/asset'

// Configuration
import admin from './modules/configuration/admin'
import roles from './modules/configuration/roles'
import history from './modules/configuration/history'
import component from './modules/configuration/component'



Vue.use(Vuex)
const state = {
  showSidebar: false,
  activePage: ''
}

export default new Vuex.Store({
  modules:{
    login,
    // Inventory
    products,
    category,
    size,
    color,
    manufacture,
    stock_adjustment,
    stock_transfer, 
    assembly,
    // Purchase
    vendor,
    checkout,
    purchase,
    purchase_return,
    ap_payment,
    ap_cash,
    // Sales
    customer,
    // Ledger
    classification,
    controls,
    balance,
    account,
    journal,
    ledger,
    financial,
    // Transaction
    cashin,
    cashout,
    transfer,
    // Setting
    tax,
    branch,
    unit,
    payment,
    bank,
    currency,
    cost,
    asset,
    // Configuration
    admin,
    roles,
    component,
    history

  },
  state
})