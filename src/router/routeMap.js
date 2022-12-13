import Dashboard from '@/pages/Dashboard'

// Purchase
import Vendor from '@/pages/purchase/Vendor'
import Purchase from '@/pages/purchase/Purchase'
import AP_Payment from '@/pages/purchase/AP_Payment'
import APCash from '@/pages/purchase/APCash'
import Checkout from '@/pages/purchase/Checkout'
import Purchase_Return from '@/pages/purchase/Purchase_Return'

// Inventory
import Category from '@/pages/inventory/Category'
import Manufacture from '@/pages/inventory/Manufacture'
import Product from '@/pages/inventory/Product'
import Attribute from '@/pages/inventory/Attribute'
import Stock_Adjustment from '@/pages/inventory/Stock_Adjustment'
import Stock_Transfer from '@/pages/inventory/Stock_Transfer'
import Assembly from '@/pages/inventory/Assembly'

// Sales
import Customer from '@/pages/sales/Customer'
import Sales from '@/pages/sales/Sales'
import POS from '@/pages/sales/POS'

// Transaction
import Cash_In from '@/pages/transaction/Cash_In'
import Cash_Out from '@/pages/transaction/Cash_Out'
import Transfer from '@/pages/transaction/Transfer'

// General Ledger
import Classification from '@/pages/general_ledger/Classification'
import Report_Reference from '@/pages/general_ledger/Report_Reference'
import Controls from '@/pages/general_ledger/Controls'
import Balance from '@/pages/general_ledger/Balance'
import Account from '@/pages/general_ledger/Account'
import Journal_Gl from '@/pages/general_ledger/Journalgl'
import Ledger from '@/pages/general_ledger/Ledger'

// Payroll
import Division from '@/pages/payroll/Division'
import Employee_List from '@/pages/payroll/Employee_List'
import Employee_Loan from '@/pages/payroll/Employee_Loan'
import Experience_Premium from '@/pages/payroll/Experience_Premium'
import Attendance from '@/pages/payroll/Attendance'
import Payroll_Transaction from '@/pages/payroll/Payroll_Transaction'

// Setting
import Tax from '@/pages/setting/Tax'
import Bank from '@/pages/setting/Bank'
import Branch from '@/pages/setting/Branch'
import Cost from '@/pages/setting/Cost'
import Currency from '@/pages/setting/Currency'
import Unit from '@/pages/setting/Unit'
import Conversion from '@/pages/setting/Conversion'
import Payment from '@/pages/setting/Payment'
import Asset from '@/pages/setting/Asset'


// Configuration
import Web_Admin from '@/pages/configuration/Web_Admin'
import Component_Manager from '@/pages/configuration/Component_Manager'
import Widget_List from '@/pages/configuration/Widget_List'
import Role from '@/pages/configuration/Role'
import History from '@/pages/configuration/History'
import Global_Configuration from '@/pages/configuration/Global_Configuration'

// Bulking Storage
import Contract from '@/pages/bulking_storage/Contract'
import Shorec from '@/pages/bulking_storage/Shorec'
import Sounding from '@/pages/bulking_storage/Sounding'
import Tank_Gl from '@/pages/bulking_storage/Tank_Gl'
import Tank from '@/pages/bulking_storage/Tank'
import TChange from '@/pages/bulking_storage/TChange'

let peta = {
  // Dasboard
  main: {
    path: "/dashboard",
    displayName: "Dashboard",
    component: Dashboard,
  },

  // Purchase
  purchase_menu: {
    displayName: 'Purchase'
  },
  vendor: {
    path: '/purchase/vendor',
    displayName: 'Vendor',
    component: Vendor,
    parent: 'purchase_menu',
    useSidebar: true
  },
  purchase: {
    path: '/purchase/purchase_order',
    displayName: 'Purchase Order',
    component: Purchase,
    parent: 'purchase_menu'
  },
  ap_payment: {
    path: '/purchase/ap_payment',
    displayName: 'AP - Payment',
    component: AP_Payment,
    parent: 'purchase_menu'
  },
  apc: {
    path: '/purchase/ap_cash',
    displayName: 'AP - Cash Transaction',
    component: APCash,
    parent: 'purchase_menu'
  },
  checkout: {
    path: '/purchase/checkout',
    displayName: 'Checkout',
    component: Checkout,
    parent: 'purchase_menu'
  },
  purchase_return: {
    path: '/purchase/purchase_return',
    displayName: 'Purchase Return',
    component: Purchase_Return,
    parent: 'purchase_menu'
  },

  // Inventory
  inventory_menu: {
    displayName: 'Inventory',
  },
  category: {
    path: '/inventory/category',
    displayName: 'Category',
    component: Category,
    parent: 'inventory_menu'
  },
  manufacture: {
    path: '/inventory/manufacture',
    displayName: 'Manufactures',
    component: Manufacture,
    parent: 'inventory_menu'
  },
  product: {
    path: '/inventory/product',
    displayName: 'Product List',
    component: Product,
    parent: 'inventory_menu'
  },
  attribute: {
    path: '/inventory/attribute',
    displayName: 'Attributes',
    component: Attribute,
    parent: 'inventory_menu'
  },
  stock_adjustment: {
    path: '/inventory/stock_adjustment',
    displayName: 'Stock Adjustment',
    component: Stock_Adjustment,
    parent: 'inventory_menu'
  },
  stock_transfer: {
    path: '/inventory/stock_transfer',
    displayName: 'Inventory Transfer',
    component: Stock_Transfer,
    parent: 'inventory_menu'
  },
  assembly: {
    path: '/inventory/assembly',
    displayName: 'Assembly Process',
    component: Assembly,
    parent: 'inventory_menu'
  },

  // Sales
  sales_menu: {
    displayName: 'Sales',
  },
  customer: {
    path: '/sales/customer',
    displayName: 'Customers',
    component: Customer,
    parent: 'sales_menu'
  },
  sales: {
    path: '/sales/sales',
    displayName: 'Sales',
    component: Sales,
    parent: 'sales_menu'
  },
  pos: {
    path: '/sales/pos',
    displayName: 'Point Of Sale',
    component: POS,
    parent: 'sales_menu'
  },

  //Transaction
  transaction_menu: {
    displayName: 'Transaction',
  },
  cashin: {
    path: '/transaction/cash_in',
    displayName: 'Cash In',
    component: Cash_In,
    parent: 'transaction_menu'
  },
  cashout: {
    path: '/transaction/cash_out',
    displayName: 'Cash Out',
    component: Cash_Out,
    parent: 'transaction_menu'
  },
  transfer: {
    path: '/transaction/transfer',
    displayName: 'Fund Transfer',
    component: Transfer,
    parent: 'transaction_menu'
  },



  //General Ledger
  general_ledger_menu: {
    displayName: 'General Ledger',
  },
  classification: {
    path: '/general_ledger/classification',
    displayName: 'Acc Classification',
    component: Classification,
    parent: 'general_ledger_menu'
  },
  report_reference: {
    path: '/general_ledger/report_reference',
    displayName: 'Financial Report',
    component: Report_Reference,
    parent: 'general_ledger_menu'
  },
  controls: {
    path: '/general_ledger/controls',
    displayName: 'Account Controls',
    component: Controls,
    parent: 'general_ledger_menu'
  },
  balance: {
    path: '/general_ledger/balance',
    displayName: 'Open Balance',
    component: Balance,
    parent: 'general_ledger_menu'
  },
  account: {
    path: '/general_ledger/account',
    displayName: 'Chart Of Account',
    component: Account,
    parent: 'general_ledger_menu'
  },
  journalgl: {
    path: '/general_ledger/journalgl',
    displayName: 'GL - Journal Transaction',
    component: Journal_Gl,
    parent: 'general_ledger_menu'
  },
  ledger: {
    path: '/general_ledger/ledger',
    displayName: 'Account Ledger',
    component: Ledger,
    parent: 'general_ledger_menu'
  },

  // Payroll
  payroll_menu: {
    displayName: "Payroll"
  },
  division: {
    path: '/payroll/division',
    displayName: 'Division',
    component: Division,
    parent: 'payroll_menu'
  },
  employee_list: {
    path: '/payroll/employee_list',
    displayName: 'Employee List',
    component: Employee_List,
    parent: 'payroll_menu'
  },
  employee_Loan: {
    path: '/payroll/employee_Loan',
    displayName: 'Employee Loan',
    component: Employee_Loan,
    parent: 'payroll_menu'
  },
  experience_premium: {
    path: '/payroll/experience_premium',
    displayName: 'Experience Premium',
    component: Experience_Premium,
    parent: 'payroll_menu'
  },
  attendance: {
    path: '/payroll/attendance',
    displayName: 'Attendance',
    component: Attendance,
    parent: 'payroll_menu'
  },
  payroll_transaction: {
    path: '/payroll/payroll_transaction',
    displayName: 'Payroll Transaction',
    component: Payroll_Transaction,
    parent: 'payroll_menu'
  },

  // Setting
  setting_menu: {
    displayName: "Setting"
  },
  tax: {
    path: '/setting/tax',
    displayName: 'Tax List',
    component: Tax,
    parent: 'setting_menu'
  },
  branch: {
    path: '/setting/branch',
    displayName: 'Branch Outlet',
    component: Branch,
    parent: 'setting_menu'
  },
  currency: {
    path: '/setting/currency',
    displayName: 'Currrency List',
    component: Currency,
    parent: 'setting_menu'
  },
  // conversion: {
  //   path: '/setting/conversion',
  //   displayName: 'Number Conversion',
  //   component: Conversion,
  //   parent: 'setting_menu'
  // },
  unit: {
    path: '/setting/unit',
    displayName: 'Measurement Unit',
    component: Unit,
    parent: 'setting_menu'
  },
  payment: {
    path: '/setting/payment',
    displayName: 'Payment Type',
    component: Payment,
    parent: 'setting_menu'
  },
  bank: {
    path: '/setting/bank',
    displayName: 'Bank Details',
    component: Bank,
    parent: 'setting_menu'
  },
  cost: {
    path: '/setting/cost',
    displayName: 'Cost Type',
    component: Cost,
    parent: 'setting_menu'
  },
  asset: {
    path: '/setting/asset',
    displayName: 'Fixed Assets',
    component: Asset,
    parent: 'setting_menu'
  },

  // Configuration
  configuration_menu: {
    displayName: "Configuration"
  },
  web_admin: {
    path: '/configuration/web_admin',
    displayName: 'Web Admin',
    component: Web_Admin,
    parent: 'configuration_menu'
  },
  component_manager: {
    path: '/configuration/component_manager',
    displayName: 'Component Manager',
    component: Component_Manager,
    parent: 'configuration_menu'
  },
  widget_list: {
    path: '/configuration/widget_list',
    displayName: 'Widget List',
    component: Widget_List,
    parent: 'configuration_menu'
  },
  history: {
    path: '/configuration/history',
    displayName: 'History',
    component: History,
    parent: 'configuration_menu'
  },
  role: {
    path: '/configuration/role',
    displayName: 'Role',
    component: Role,
    parent: 'configuration_menu'
  },
  global_configuration: {
    path: '/configuration/global_configuration',
    displayName: 'Global Configuration',
    component: Global_Configuration,
    parent: 'configuration_menu'
  },

  // Bulking Storage
  // bulking_menu: {
  //   displayName: "Bulking Storage"
  // },
  // contract: {
  //   path: '/bulking/contract',
  //   displayName: 'Contract',
  //   component: Contract,
  //   parent: 'bulking_menu'
  // },
  // shorec: {
  //   path: '/bulking/shorec',
  //   displayName: 'Shore Calculation',
  //   component: Shorec,
  //   parent: 'bulking_menu'
  // },
  // sounding: {
  //   path: '/bulking/sounding',
  //   displayName: 'Sounding',
  //   component: Sounding,
  //   parent: 'bulking_menu'
  // },
  // tankgl: {
  //   path: '/bulking/tankGl',
  //   displayName: 'Tank_Gl',
  //   component: Tank_Gl,
  //   parent: 'bulking_menu'
  // },
  // tank: {
  //   path: '/bulking/tank',
  //   displayName: 'Storage Tank',
  //   component: Tank,
  //   parent: 'bulking_menu'
  // },
  // tchange: {
  //   path: '/bulking/tchange',
  //   displayName: 'Tank Status Change',
  //   component: TChange,
  //   parent: 'bulking_menu'
  // },
};

export function getRoutes() {
  let routes = []
  for (let prop in peta) {
    if (peta[prop].path) {
      let r = {}
      r.path = peta[prop].path
      r.name = prop
      r.displayName = peta[prop].displayName
      r.component = peta[prop].component
      routes.push(r)
    }
  }
  return routes
}

export function getMenuMap() {
  let menuList = peta
  return menuList
}
