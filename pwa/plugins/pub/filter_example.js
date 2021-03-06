var exports = {};
var jwt = require('jsonwebtoken');
var fs = require('fs');
var dns = require('dns');
var async = require('async');


function generateJWT(host) {

    // Load the private key
    var privateKey = fs.readFileSync(__dirname + '/rabbit-private.pem');

    var exp = Math.floor(Date.now() / 1000) + (60 * 60 * 30) // 30 hours
    // Round expiration up to nearest 7 day interval
    exp = Math.ceil(exp/7/86400)*7*86400;

    // Create the payload object
    // TODO: The sub should be the host for which we are creating this token for
    payload = {
        scope:  "my_rabbit_server.write:osg-nma/osg.ps-push.raw/perfsonar.raw.*",
        exp: exp,
        aud: "my_rabbit_server",
        sub: host,
        client_id: host
    };
    return jwt.sign(payload, privateKey, { algorithm: 'RS256', keyid: 'pf-key', noTimestamp: true });

}

function getDomain(hostname) {
    try {
        var split_hostname = hostname.split(".");
        // Join only the last 2 elements
        // from https://stackoverflow.com/questions/6473858/in-a-javascript-array-how-do-i-get-the-last-5-elements-excluding-the-first-ele
        var domain = split_hostname.slice(Math.max(split_hostname.length - 2, 0)).join(".");
        return domain;
    } catch (err) {
        return "";
    }
}

function reverseDNS(ip, timeout, callback) {
    var callbackCalled = false;
    var doCallback = function(err, hostnames) {
        if (callbackCalled) return;
        callbackCalled = true;
        callback(err, hostnames);
    };

    setTimeout(function() {
        doCallback(new Error("Timeout exceeded"), null);
    }, timeout);

    dns.reverse(ip, doCallback);

}

exports.process = function( request, psconfig_in, results_callback ) {
    //console.log("request", request);
    //console.log("psconfig_in", psconfig_in);

    //console.log("headers", request.headers);
    // Resolve the hostname to ips (v4 and v6)
    var requested_host = request.params.address
    var requesting_ip = request.headers['x-forwarded-for']

    reverseDNS(requesting_ip, 5000, function(err, hostnames) {
        if (err) {
            console.log("Unable to reverse DNS the ip: " + requesting_ip);
            console.log(err);
            results_callback(null, psconfig_in);
        } else {
            // Get all of the domains
            var requested_domain = getDomain(requested_host);
            var requesting_domains = hostnames.map(getDomain);
            if (requesting_domains.indexOf(requested_domain) > -1) {
                var token = generateJWT(requested_host);
                var final_url = "amqps://" + requested_host + ":" + token + "@clever-turkey.rmq.cloudamqp.com/osg-nma";
                for (const archive_name in psconfig_in.archives) {
                    archive = psconfig_in.archives[archive_name];
                    if (archive.archiver == "rabbitmq") {
                        if (archive.data._url.search("clever-turkey.rmq.cloudamqp.com") >= 0) {
                            archive.data._url = final_url;
                            break;
                        }
                    }
                }
            }
            results_callback(null, psconfig_in);
        }
    });

};


module.exports = exports;

