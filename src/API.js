// //@ts-check
//Babel-Polyfill for await\async


import "babel-polyfill";
require("babel-core/register");

require('fetch-everywhere');

import FormData from 'form-data';
// import Headers from "headers";
import Q from "q";



// /** Define the URL  */
const WEBSITE = "https://roosterteeth.com/"

// /**
//  * Helper function to simplify making API requests
//  * @param {String} endPoint 
//  * @param {Object:RequestInit} opts - The Options objected to be supplied
//  * @returns A promise, that resolves with a JSON object, or throws an error.
//  */
function makeAPIRequest(endPoint, opts) {
	//arguments
	let raw;
	var deferred = Q.defer();
	// deferred.notify( "request begun");

	fetch(WEBSITE + endPoint, opts).then(
		(response) => { raw = response; return response.json() },
		(error) => { console.log("TODO: Handle error", error); deferred.reject(error); }
	).then(json => {
		deferred.resolve(json);
	}, (fail) => { console.log("Invalid JSON"); console.log(raw); })
	return deferred.promise;
}

function generateOpts(token) {
	return {
		headers: {
			'Authorization': token
		}
	}
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

/**
 * 
 * @param {*} count 
 * @param {*} page 
 * @param {*} site - 
 * @param {*} type - Seems to accept only Episode, News
 * @param {*} token 
 */
export async function getFeed(count, page, site, type, token) {

	var result = await makeAPIRequest(`/api/v1/feed?count=${count}&page=${page}&site=${site}&type=${type}`
		, generateOpts(token));

	return result;
}


export async function getShows(count, page, site, token) {

	var result = await makeAPIRequest(`/api/v1/shows?count=${count}&page=${page}&site=${site}`
		, generateOpts(token));

	return result;
}

export async function getSeasons(showID, count, page, token) {
	var opts = {
		headers: {
			'Authorization': token
		}
	}
	var result = await makeAPIRequest(`/api/v1/shows/${showID}/seasons?count=${count}&page=${page}`, opts);

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

export async function getSites(token) {
	//GET /api/xbox/v1/channels HTTP/1.1
	var opts = {
		headers: {
			'Authorization': token
		}
	}
	var result = await makeAPIRequest(`/api/xbox/v1/channels`, opts);

	return result;
}

export async function getChannel(id, token) {
	var result = await makeAPIRequest(`/api/xbox/v1/channels/${id}`, generateOpts(token));

	return result;
}

/**
 * Get the Queue of videos a users has created to watch.
 * @param {Number} id - Specify the user's queue to see  
 * @param {Number} count - Specify the number of results to return 
 * @param {Number} page - Specify the page to see 
 * @param {String} token - The Access Token
 * @returns {JSON} An array of Episodes objects
 */
export async function getQueue(id, count, page, token) {
	var result = await makeAPIRequest(`/api/v1/users/${id}/queue?count=${count}&page=${page}`, generateOpts(token));
	return result;
}
/**
 * Add a specific episode to the user's queue
 * @param {Number} episodeID - The ID of the episode to add to the queue
 * @param {String} token - The Access Token
 */
export async function addToQueue(episodeID, token) {
	var result = await makeAPIRequest(`/api/v1/episodes/${id}/add-to-queue`, { method: "POST", headers: { 'Authorization': token } });

	return result;
}
/**
 * Removes the specified ID from the current user's queue
 * @param {Number} episodeID 
 * @param {String} token 
 */
export async function removeFromQueue(episodeID, token) {
	var result = await makeAPIRequest(`/api/v1/episodes/${id}/remove-from-queue`,
		{
			method: "DELETE",
			headers: {
				'Authorization': token
			}
		})
	return result;
}

/**
 * Gets the currently logged-in user's token. 
 * @param {String} token - Access Token
 */
export function getCurrentUserID(token) {
	//This is tricky. We have to read the header of a response
	console.warn("NYI");
}

/**
 * Gets detail about the specified user
 * @param {Number} userID - The user to get detail about 
 * @param {String} token 
 */
export async function getUserDetail(userID, token) {
	//GET /api/v1/users/${id} 
	let result = await makeAPIRequest(`/api/v1/users/${userID}`, generateOpts(token));

	return result;
}

/**
 * Marks a specific episode as watched (Honestly think this is going to be deprecated)
 * @param {Number} episodeID 
 * @param {String} token 
 * @returns {Object} success - true\false 
 */
export async function markWatched(episodeID, token) {
	let result = await makeAPIRequest(`/api/v1/episodes/${id}/mark-as-watched`,
		{
			method: 'PUT', headers: {
				'Authorization': token
			}
		});
	return result;
}

/**
 * 
 * @param {Number} count 
 * @param {Number} page 
 * @param {String} token 
 */
export async function getLive(count, page, token) {
	let result = await makeAPIRequest(`/api/v1/live?count=${count}&page=${page}`,
		generateOpts(token))

	return result;
}

/* 
TODO: 





(Basically the community related aspects of the API )
There also seems to be ways to pull the merch (
    GET /api/v1/episodes/31790?include=merch%2CupNext%2CmoreFrom HTTP/1.1
merch,upNext,moreFrom ?
)

-
Probably should refactor, so it's more of an interface\class 
*/