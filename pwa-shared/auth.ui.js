'use strict';

angular.module('app.config', [])
.constant('appconf', {

    title: 'PWA Authentication Service',

    admin_email: 'smckee@umich.edu',
    logo_400_url: 'images/pscweb_logo.png',

    oidc_logo: 'images/cilogon.png',

    //URL for auth service API
    api: '../api/auth',

    //URL for x509 validation API
    x509api: 'https://'+location.hostname+':9443',

    //default location to redirect after successful login
    //default_redirect_url: '../profile',
    default_redirect_url: '/',

    jwt_id: 'jwt',
    iucas_url: 'https://cas.iu.edu/cas/login',

    jwt_whitelist: [location.hostname],

   //show/hide various login options
    show: {
        local: true,
        ldap: false,

        iucas: false,
        google: true,
        git: false,
        x509: true,
        github: false,
        facebook: false,

        oidc: false, //cilogon openid-connect service
        //oidc_selector: false, //show idp selector

        signup: true,
    },
});

