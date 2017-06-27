// //@ts-check
//Babel-Polyfill for await\async


import "babel-polyfill";
require("babel-core/register");

import fetch from 'node-fetch';
import FormData from 'form-data';
// import Headers from "headers";
import Q from "q";



// /** Define the URL  */
const WEBSITE = "https://roosterteeth.com/"

// /**
//  * Helper function to simplify making API requests
//  * @param {String} endPoint 
//  * @param {Object:RequestInit} opts - The Options objected to be supplied
//  * @returns A promise, that resolving with a JSON object, or throws an error.
//  */
function makeAPIRequest(endPoint, opts) {
    //arguments
    var deferred = Q.defer();
    // deferred.notify( "request begun");

    fetch(WEBSITE + endPoint, opts).then(
        response => response.json(), error => { console.log("TODO: Handle error", error); deferred.reject(error); }
    ).then(json => {
        deferred.resolve(json);
    })
    return deferred.promise;
}


export const login = async (user, password) => {
    var form = new FormData();
    form.append("username", user);
    form.append("password", password);
    //Consts (Unsure of what these are)
    form.append("client_id", "aToGIjvJ8Lofqmso");
    //TODO: Randomly and securely generate this ( md5 )
    form.append("client_secret", "oW3CtlpnXRznUUiWLXzmaIQryFBfGmNt");

    //Specific because it's email-based
    form.append("grant_type", "password");
    form.append("scope", "user.access");
    var opts = {
        method: "POST",
        body: form
    }
    var result = await makeAPIRequest("/authorization/oauth-access-token", opts);
    return result;
}


export async function getFeed(count, page, site, type, token) {
    var opts = {
        headers: {
            'Authorization': token
        }
    }
    var result = await makeAPIRequest(`/api/v1/feed?count=${count}&page=${page}&site=${site}&type=${type}`, opts);

    return result;
}


export async function getShows(count, page, site, token) {
    var opts = {
        headers: {
            'Authorization': token
        }
    }
    var result = await makeAPIRequest(`/api/v1/shows?count=${count}&page=${page}&site=${site}`, opts);

    return result;
}

export async function getSeasons(showID, count, page, token) {
    var opts = {
        headers: {
            'Authorization': token
        }
    }
    var result = await makeAPIRequest(`/api/v1/show/${showID}/seasons?count=${count}&page=${page}`, opts);

    return result;
}

export async function getEpisodes(seasonID, count, page, token) {
    var opts = {
        headers: {
            'Authorization': token
        }
    }
    var result = await makeAPIRequest(`/api/v1/seasons/${seasonID}/episodes?count=${count}&page=${page}`, opts);

    return result;
}

export async function getEpisodeInfo(episodeID, token) {
    var opts = {
        headers: {
            'Authorization': token
        }
    }
    var result = await makeAPIRequest(`/api/v1/episodes/${episodeID}`, opts);

    return result;
}

export async function getSites() {
    //GET /api/xbox/v1/channels HTTP/1.1
    var opts = {
        headers: {
            'Authorization': token
        }
    }
    var result = await makeAPIRequest(`/api/xbox/v1/channels`, opts);

    return result;
}

// export async function getQueue( )
/* 
TODO: 
getQueue
getUserDetail
(Basically the community related aspects of the API )
There also seems to be ways to pull the merch (
    GET /api/v1/episodes/31790?include=merch%2CupNext%2CmoreFrom HTTP/1.1
merch,upNext,moreFrom ?
)

-
Probably should refactor, so it's more of an interface\class 
*/