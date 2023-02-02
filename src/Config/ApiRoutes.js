/** @format */

const ApiRoutes = {
  LOGIN: {
    service: '/admin',
    url: '/login',
    method: 'POST',
    authenticate: false,
  },

  GET_DASHBOARD: {
    service: '/admin',
    url: '/getDashboard',
    method: 'GET',
    authenticate: true,
  },

  GET_SETTINGS: {
    service: '/admin',
    url: '/view',
    method: 'GET',
    authenticate: true,
  },
  PROXY_LOGIN: {
    service: '/users',
    url: '/proxy-login',
    method: 'POST',
    authenticate: true,
  },
  UPDATE_SETTINGS: {
    service: '/admin',
    url: '/update',
    method: 'POST',
    authenticate: true,
  },
  GETPROJECTS: {
    service: '/admin',
    url: '/getprojects',
    method: 'GET',
    authenticate: true,
  },
  CHANGESTATUS: {
    service: '/admin',
    url: '/changestatus',
    method: 'POST',
    authenticate: true,
  },
  GETUSERS: {
    service: '/admin',
    url: '/getusers',
    method: 'GET',
    authenticate: true,
  },
  UPDATE_USER_STATUS: {
    service: '/admin',
    url: '/changeSelectedUserStatus',
    method: 'POST',
    authenticate: true,
  },
  FILTERUSERS: {
    service: '/admin',
    url: '/filterusers',
    method: 'GET',
    authenticate: true,
  },
  GETALLCOMMENTS: {
    service: '/admin',
    url: '/getComments',
    method: 'GET',
    authenticate: true,
  },
  UPDATE_COMMENT_STATUS: {
    service: '/admin',
    url: '/changeSelectedCommentStatus',
    method: 'POST',
    authenticate: true,
  },
  UPDATE_FEATURED_PROJECT: {
    service: '/admin',
    url: '/updateFeaturedProjects',
    method: 'POST',
    authenticate: true,
  },
  UPDATE_FEATURED_USER: {
    service: '/admin',
    url: '/updateFeaturedUsers',
    method: 'POST',
    authenticate: true,
  },
  GET_DONATIONS: {
    service: '/admin',
    url: '/donations',
    method: 'GET',
    authenticate: true,
  },
  UPATE_PAYOUT_STATUS: {
    service: '/admin',
    url: '/donation/update-status',
    method: 'POST',
    authenticate: true,
  },
  EXPORT_PAYPAL_DONATIONS: {
    service: '/admin',
    url: '/donation/export',
    method: 'get',
    authenticate: true,
  },
  GET_CONTACTUS_LIST:{
    service: "/admin",
    url: "/getContactusList",
    method: "GET",
    authenticate: true
  },
  CHANGE_CONTACTUS_STAUS:{
    service: "/admin",
    url: "/change-status",
    method: "POST",
    authenticate: true
  }
};

export default ApiRoutes;
