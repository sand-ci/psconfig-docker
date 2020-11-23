'use strict';

var fs = require('fs');
var winston = require('winston');

//path to your user cert / ca to access gocdb
var mycert = fs.readFileSync('/etc/grid-security/user/cert.pem', {encoding: 'ascii'});
var mykey = fs.readFileSync('/etc/grid-security/user/key.pem', {encoding: 'ascii'});
var gocdbca = `-----BEGIN CERTIFICATE-----
MIIDhjCCAm6gAwIBAgIBADANBgkqhkiG9w0BAQUFADBUMQswCQYDVQQGEwJVSzEV
MBMGA1UEChMMZVNjaWVuY2VSb290MRIwEAYDVQQLEwlBdXRob3JpdHkxGjAYBgNV
BAMTEVVLIGUtU2NpZW5jZSBSb290MB4XDTA3MTAzMDA5MDAwMFoXDTI3MTAzMDA5
MDAwMFowVDELMAkGA1UEBhMCVUsxFTATBgNVBAoTDGVTY2llbmNlUm9vdDESMBAG
A1UECxMJQXV0aG9yaXR5MRowGAYDVQQDExFVSyBlLVNjaWVuY2UgUm9vdDCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM3ORtmmUHotwDTfAH5/eIlo3+BK
oElDeaeN5Sg2lhPu0laPch7pHKSzlqyHmZGsk3fZb8hBmO0lD49+dKnA31zLU6ko
Bje1THqdrGZPcjTm0lhc/SjzsBtWm4oC/bpYBACliB9wa3eSuU4Rqq71n7+4J+WO
KvaDHvaTdRYE3pyie2Xe5QTI8CXedCMh18+EdFvwlV79dlmNRNY93ZWUu6POL6d+
LapQkUmasXLjyjNzcoPXgDyGauHOqmyqxuPx4tDTsC25nKr+7K5k3T+lplJ/jMkQ
l/QHgqnABBXQILzzrt0a8nQdM8ONA+bht+8sy4eN/0zMulNj8kAzrutkhJsCAwEA
AaNjMGEwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAQYwHQYDVR0OBBYE
FF74G0imd2spPC4AUzMrY6J7fpPAMB8GA1UdIwQYMBaAFF74G0imd2spPC4AUzMr
Y6J7fpPAMA0GCSqGSIb3DQEBBQUAA4IBAQCT0a0kcE8oVYzjTGrd5ayvOI+vbdiY
MG7/2V2cILKIts7DNdIrEIonlV0Cw96pQShjRRIizSHG5eH1kLJcbK/DpgX6QuPR
WhWR5wDJ4vaz0qTmUpwEpsT9mmyehhHbio/EsYM7LesScJrO2piD2Bf6pFUMR1LC
scAqN7fTXJSg6Mj6tOhpWpPwM9WSwQn8sDTgL0KkrjVOVaeJwlyNyEfUpJuFIgTl
rEnkXqhWQ6ozArDonB4VHlew6eqIGaxWB/yWMNvY5K+b1j5fdcMelzA45bFucOf1
Ag+odBgsGZahpFgOqKvBuvSrk/8+ie8I2CVYwT486pPnb5JFgHgUfZo8
-----END CERTIFICATE-----`;

//gocdb2sls specific config (you need to create this directory and give proper file permission)
exports.gocdb2sls = {
    cache_dir: '/cache'
}

//specify options to request xml from GOCDB for site information
//This information maybe used to augument information from the toolkit itself (but I might not need it..)
exports.site_xml = {
    url: 'https://goc.egi.eu/gocdbpi/private/?method=get_site',
    cert: mycert, key: mykey, ca: gocdbca
}

//endpoints XML to load and process (you can list multiple URLs for each services that you want to load)
exports.endpoint_xmls = [
    {
        url: 'https://goc.egi.eu/gocdbpi/private/?method=get_service_endpoint&service_type=net.perfSONAR.Bandwidth',
        cert: mycert, key: mykey, ca: gocdbca
    },
    {
        url: 'https://goc.egi.eu/gocdbpi/private/?method=get_service_endpoint&service_type=net.perfSONAR.Latency',
        cert: mycert, key: mykey, ca: gocdbca
    }
]

exports.toolkit = {
    //amount of time to attemp loading sonars' /toolkit?format=json
    timeout: 1000*20,

    /* these things doesn't seems to help
    //for hosts that force redirect to https:
    rejectUnhauthorized : false, //ignore DEPTH_ZERO_SELF_SIGNED_CERT
    strictSSL: false, //ignore SELF_SIGNED_CERT_IN_CHAIN
    cert: mycert, key: mykey, ca:gocdbca //use the same key use to contact gocdb ..
    */
}

//configuration for Simple Lookup Serivce to store data
exports.sls = {
    //You SLS URL to post records
    url: "http://sls:8090",

    //Global sLS instance to check against host record
    //global_url: "http://ps-east.es.net:8090",
}

exports.logger = {
    winston: {
        transports: [
            //display all logs to console
            new winston.transports.Console({
                timestamp: function() {
                    var d = new Date();
                    return d.toString(); //show timestamp
                },
                colorize: true,
                level: 'debug'
            }),
        ]
    }
}
