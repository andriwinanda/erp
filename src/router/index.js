import Vue from 'vue'
import Router from 'vue-router'
import inputToken from '../components/inputToken'
import Login from '../components/Login'
import FormPurchase from '../components/Purchase/FormPurchase'
import FormCashInOut from '../components/Transaction/FormCashInOut'
import FormStockAdj from '../components/Inventory/FormStockAdj'
import FormStockTrf from '../components/Inventory/FormStockTrf'
import FormAssembly from '../components/Inventory/FormAssembly'
import FormApPayment from '../components/Purchase/FormApPayment'
import FormApCash from '../components/Purchase/FormApCash'
import FormPurchaseReturn from '../components/Purchase/FormPurchaseReturn'
import FormJournal from '../components/GL/FormJournal'
import ReportLedger from '../components/GL/ReportLedger'
import store from '../store/store'

// Financial Report
import ProfitLoss from '../components/GL/FinancialReport/ProfitLoss'
import CashFlow from '../components/GL/FinancialReport/CashFlow'
import BalanceSheet from '../components/GL/FinancialReport/BalanceSheet'
import TrialBalance from '../components/GL/FinancialReport/TrialBalance'
import GeneralLedger from '../components/GL/FinancialReport/GeneralLedger'

Vue.use(Router)

import { getRoutes } from './routeMap.js';

let routes = getRoutes()
routes.push(
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/get_url',
    component: inputToken
  },
  {
    path: '/login',
    component: Login,
    displayName: 'Login'
  },
  // Purchase Add & Edit Page
  {
    path: '/purchase/purchase_order/edit/:id',
    component: FormPurchase
  },
  {
    path: '/purchase/purchase_order/add',
    component: FormPurchase
  },
  // Cash In Add & Edit Page
  {
    path: '/transaction/cashin/edit/:id',
    name: 'cashin',
    component: FormCashInOut
  },
  {
    path: '/transaction/cashin/add',
    name: 'cashin_add',
    component: FormCashInOut
  },
  // Cash Out Add & Edit Page
  {
    path: '/transaction/cashout/edit/:id',
    name: 'cashout',
    component: FormCashInOut
  },
  {
    path: '/transaction/cashout/add',
    name: 'cashout_add',
    component: FormCashInOut
  },
  // Stock Adj Add & Edit Page
  {
    path: '/inventory/stock_adjustment/edit/:id',
    name: 'stock_adjustment',
    component: FormStockAdj
  },
  {
    path: '/inventory/stock_adjustment/add',
    name: 'stock_adjustment',
    component: FormStockAdj
  },
  // Stock Trf Add & Edit Page
  {
    path: '/inventory/stock_transfer/edit/:id',
    name: 'stock_transfer',
    component: FormStockTrf
  },
  {
    path: '/inventory/stock_transfer/add',
    name: 'stock_transfer',
    component: FormStockTrf
  },
  // Assembly Add & Edit Page
  {
    path: '/inventory/assembly/edit/:id',
    name: 'assembly',
    // displayName: 'Assembly Proccess',
    component: FormAssembly
  },
  {
    path: '/inventory/assembly/add',
    name: 'assembly',
    // displayName: 'Assembly Proccess',
    component: FormAssembly
  },
  // AP Payment Add & Edit Page
  {
    path: '/purchase/ap_payment/edit/:id',
    name: 'ap_payment',
    component: FormApPayment
  },
  {
    path: '/purchase/ap_payment/add',
    name: 'ap_payment',
    component: FormApPayment
  },
  
  // AP Cash Add & Edit Page
  {
    path: '/purchase/apc/edit/:id',
    name: 'ap_payment',
    component: FormApCash
  },
  {
    path: '/purchase/apc/add',
    name: 'ap_payment',
    component: FormApCash
  },
  
  // Puerchase Add & Edit Page
  {
    path: '/purchase/purchase_return/edit/:id',
    name: 'purchase_return',
    component: FormPurchaseReturn
  },
  {
    path: '/purchase/purchase_return/add',
    name: 'purchase_return',
    component: FormPurchaseReturn
  },
  
  // Puerchase Add & Edit Page
  {
    path: '/general_ledger/journalgl/edit/:id',
    component: FormJournal
  },
  {
    path: '/general_ledger/journalgl/add',
    component: FormJournal
  },
  // Report Ledger
  {
    path: '/general_ledger/ledger/report',
    component: ReportLedger
  },
  // Financial Report
  {
    path: '/general_ledger/report_reference/profit',
    component: ProfitLoss
  },
  {
    path: '/general_ledger/report_reference/balance_sheet',
    component: BalanceSheet
  },
  {
    path: '/general_ledger/report_reference/cashflow',
    component: CashFlow
  },
  {
    path: '/general_ledger/report_reference/trial_balance',
    component: TrialBalance
  },
  {
    path: '/general_ledger/report_reference/general_ledger',
    component: GeneralLedger
  },
)

const router = new Router({
  routes,
  mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
})
router.beforeEach((to, from, next) => {
  let baseUrl = localStorage.getItem("baseUrl");
  let token = localStorage.getItem("token");

  if (to.path !== '/login' && to.path != '/get_url') {
    if (!baseUrl) {
      store.dispatch("login/logout")
      next('/get_url')
    } else if (!token) {
      store.dispatch("login/logout")
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router;
