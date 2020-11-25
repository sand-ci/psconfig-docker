//node
const fs = require('fs');
const winston = require('winston');

exports.auth = {
    //default user object when registered
    default: {
        scopes: {
            sca: ["user"],
            pwa: ["user"], //needed by pwa
        },
        gids: [ /*1*/ ],
    },

    //isser to use for generated jwt token
    iss: "https://psconfig.opensciencegrid.org/auth",
    //ttl for jwt
    ttl: 24*3600*1000, //1 day

    public_key: fs.readFileSync(__dirname+'/auth.pub'),
    private_key: fs.readFileSync(__dirname+'/auth.key'),

    //option for jwt.sign
    sign_opt: {algorithm: 'RS256'},

    allow_signup: true, //prevent user from signing in
};

//comment this out if you don't want to confirm email
exports.email_confirmation = {
    subject: 'pSConfig Web Admin Account Confirmation',
    from: 'pwa@psconfig.opensciencegrid.org',  //most mail server will reject if this is not replyable address
};

//for local user/pass login (you should use either local, or ldap - but not both)
exports.local = {
    //url base for callbacks only used if req.header.referer is not set (like via cli)
    //url: 'https://<pwa_hostname>/auth',

    //comment this out if you don't want to confirm email
    email_confirmation: {
	    subject: 'pSConfig Web Admin Account Confirmation',
	    from: 'pwa@psconfig.opensciencegrid.org',  //most mail server will reject if this is not replyable address
    },
    email_passreset: {
	    subject: 'pSConfig Web Admin Password Reset',
	    from: 'pwa@psconfig.opensciencegrid.org',  //most mail server will reject if this is not replyable address
    },
    mailer: {
        host: 'postfix',
        secure: false,
        port: 25,
        tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
        }
    }
};

//comment this out to disable iucas
exports.iucas = { };

//openid connect (cilogon)
//http://www.cilogon.org/oidc
//most info can be downloaded from https://cilogon.org/.well-known/openid-configuration
exports.oidc = {
    issuer: "https://cilogon.org",
    authorization_url: "https://cilogon.org/authorize",
    token_url: "https://cilogon.org/oauth2/token",
    userinfo_url: "https://cilogon.org/oauth2/userinfo", //specific to openid connect

    callback_url: "https://psconfig.opensciencegrid.org/api/auth/oidc/callback",
    scope: "openid profile email org.cilogon.userinfo",

    client_id: fs.readFileSync(__dirname+'/oidc-client_id.key'),
    client_secret: fs.readFileSync(__dirname+'/oidc-client_secret.key'),

    idplist: "https://cilogon.org/include/idplist.xml",
};

//for x509
exports.x509 = {
    //http header to look for x509 DN
    //for nginx set proxy_set_header DN $ssl_client_s_dn
    //for apache, SSLOptions +StdEnvVars will set it to SSL_CLIENT_S_DN
    dn_header: 'dn',
    allow_origin: '*',
};


exports.db = {
    dialect: "sqlite",
    storage: "/db/auth.sqlite",
    logging: false
}

exports.express = {
    //web server port
    host: "::",
    port: 8080,
};

exports.logger = {
    winston: {
        //hide headers which may contain jwt
        requestWhitelist: ['url', /*'headers',*/ 'method', 'httpVersion', 'originalUrl', 'query'],
        transports: [
            //display all logs to console
            new winston.transports.Console({
                timestamp: function() {
                    var d = new Date();
                    return d.toString(); //show timestamp
                },
                level: 'warn',
                colorize: true
            }),
        ]
    }
}


