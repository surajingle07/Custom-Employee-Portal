const { getZohoAccessToken, fetchZohoModuleData } = require('../services/zohoService');
const logAuditAction = require('../middlewares/auditLogger');

const getZohoStatus = async (req, res) => {
  try {
    const tokenInfo = await getZohoAccessToken();
    return res.status(200).json({
      success: true,
      serviceAccount: 'Zoho One Backend Service Account',
      authenticated: true,
      mode: tokenInfo.isMock ? 'Simulated OAuth (Development / Fallback)' : 'Live Zoho OAuth 2.0',
      tokenExpiry: new Date(tokenInfo.expiresAt).toISOString(),
      message: tokenInfo.message || 'Zoho API OAuth authentication verified successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to query Zoho API status' });
  }
};

const getZohoPeople = async (req, res) => {
  try {
    await logAuditAction({ req, action: 'ZOHO_APP_ACCESS', resource: 'Zoho People (HR)', status: 'SUCCESS', details: 'Proxied request to Zoho People API via backend service account' });
    const data = await fetchZohoModuleData('people');
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Zoho People Integration Error' });
  }
};

const getZohoCRM = async (req, res) => {
  try {
    await logAuditAction({ req, action: 'ZOHO_APP_ACCESS', resource: 'Zoho CRM (Sales)', status: 'SUCCESS', details: 'Proxied request to Zoho CRM API via backend service account' });
    const data = await fetchZohoModuleData('crm');
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Zoho CRM Integration Error' });
  }
};

const getZohoDesk = async (req, res) => {
  try {
    await logAuditAction({ req, action: 'ZOHO_APP_ACCESS', resource: 'Zoho Desk (Support)', status: 'SUCCESS', details: 'Proxied request to Zoho Desk API via backend service account' });
    const data = await fetchZohoModuleData('desk');
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Zoho Desk Integration Error' });
  }
};

const getZohoBooks = async (req, res) => {
  try {
    await logAuditAction({ req, action: 'ZOHO_APP_ACCESS', resource: 'Zoho Books (Finance)', status: 'SUCCESS', details: 'Proxied request to Zoho Books API via backend service account' });
    const data = await fetchZohoModuleData('books');
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Zoho Books Integration Error' });
  }
};

module.exports = {
  getZohoStatus,
  getZohoPeople,
  getZohoCRM,
  getZohoDesk,
  getZohoBooks
};
