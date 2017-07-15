
import * as API from "./API.js";
import * as Normalize from "./Normalize.js"
var moment = require('moment');




export default class RTConnection {
    /**
     * Creates a new instance
     */
	constructor() {
		this.authToken = '';	// The Authorization Token
		this.loggedIn = null;   // Represents if the connection is authorised
		this.tokenExpiry = moment();	// The time that the token expires as a moment object

	}

    /**
     * Allows for log-in via email
     */
	async login(user, pass) {
		return API.login(user, pass).then(
			(result) => {
				//result should contain access token
				if (result.error) {
					//Failed
					this.loggedIn = false;
					this.errorMsg = result.error_message;
					return false;
				} else {
					this.authToken = result.access_token;
					this.loggedIn = true;
					this.tokenExpiry = moment().add(result.expires_in - 100, "seconds")
					return true;
				}

			}
		)
	}

	async getFeed(count, page, site, type) {
		return API.getFeed(count, page, site, type, this.authToken).then(val => {
			console.log(val);
			console.log('here');
			return Normalize.normalizeFeed(val) 
		});
	}

	async getShows(count, page, site) {
		return API.getShows(count, page, site, this.authToken).then(val => Normalize.normalizeShows(val));
	}

	async getSeasons(showID, count, page) {
		return API.getSeasons(showId, count, page, this.authToken).then( 
			val => Normalize.normalizeSeasons(val)
		)
	}

	async getEpisodes( seasonID, count, page ) { 
		return API.getEpisodes( ...arguments, this.authToken).then( (val) => { 
			return Normalize.normalizeEpisodes( val);
		})
	}

	async getEpisodeInfo( episodeID ) { 
		return API.getEpisodeInfo (episodeID, this.authToken).then( 
			(val) => Normalize.normalizeEpisodes(val)
		)
	}
	
	async getSites( ) { 
		return API.getSites(this.authToken).then( (val) => Normalize.normalizeSites(val));
	}

	async getChannel(id) { 
		return API.getChannel( id, this.authToken).then( 
			(data) => Normalize.normalizeSites(data)
		)
	}

	async getQueue(id, count, page) {
		if(id == null) { 
			//Use this.id ( when we have implemented
			console.warn("NYI");
		} else { 
			//TODO: Normalize? 
			return API.getQueue(id, count, page, this.authToken )
		}
	}

	async getLive(count,page ) {
		//TODO: Normalize? 
		return API.getLIve(count,page,this.authToken);

	}


	}


// for (var method in API) {
// 	console.log(method);
// 	if (method == "login") continue;
// 	var t = (function () {
// 		RTConnection.prototype[method] = function () {
// 			console.log('hello');
// 			console.log(arguments);
// 			API[method]()
// 			console.log(this);
// 		}
// 	})();
// }

// Object.keys(API).map((val, index) => {
// 	if(RTConnection.prototype[val] != undefined) { return; }
// 	RTConnection.prototype[val] = function () {
// 		console.log("Most likely returning unnormalised data");
// 		return API[val](...arguments, this.authToken);
// 	}
// })


