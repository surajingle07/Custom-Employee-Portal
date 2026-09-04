const zohoConfig = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN,
  accountsUrl: process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com',
  apiBaseUrl: process.env.ZOHO_API_BASE_URL || 'https://www.zohoapis.com',
  
  appMappings: {
    Admin: [
      { key: 'people', name: 'Zoho People', category: 'HR Management', url: 'https://people.zoho.com', apiEndpoint: '/api/zoho/people' },
      { key: 'crm', name: 'Zoho CRM', category: 'Sales & Customer Relations', url: 'https://crm.zoho.com', apiEndpoint: '/api/zoho/crm' },
      { key: 'desk', name: 'Zoho Desk', category: 'Customer Support & Tickets', url: 'https://desk.zoho.com', apiEndpoint: '/api/zoho/desk' },
      { key: 'books', name: 'Zoho Books', category: 'Finance & Accounting', url: 'https://books.zoho.com', apiEndpoint: '/api/zoho/books' }
    ],
    HR: [
      { key: 'people', name: 'Zoho People', category: 'HR Management', url: 'https://people.zoho.com', apiEndpoint: '/api/zoho/people' }
    ],
    Sales: [
      { key: 'crm', name: 'Zoho CRM', category: 'Sales & Customer Relations', url: 'https://crm.zoho.com', apiEndpoint: '/api/zoho/crm' }
    ],
    Support: [
      { key: 'desk', name: 'Zoho Desk', category: 'Customer Support & Tickets', url: 'https://desk.zoho.com', apiEndpoint: '/api/zoho/desk' }
    ],
    Finance: [
      { key: 'books', name: 'Zoho Books', category: 'Finance & Accounting', url: 'https://books.zoho.com', apiEndpoint: '/api/zoho/books' }
    ]
  }
};

module.exports = zohoConfig;
