require('dotenv').config();
var util = require('util');

import * as API from "./API.js";
import * as Normalize from "./Normalize.js";

// console.log(API);

// console.log( process.env.RT_USERNAME ) 

//Helper function to log nested objects
function deepLog( data ) { 
    console.log( util.inspect( data, {depth: null}))
}


//Get the Auth Token
async function main() {
    let result;
    let store = {};
    //Login
    result = await API.login(process.env.RT_USERNAME, process.env.RT_PASSWORD);
    if(result.error) { 
        console.log("Invalid User pass");
        console.log(result);
        return;
    }

    let authToken = result.access_token;

    //Get Sites
    result = await API.getSites(authToken);
    // deepLog(result)
    //Normalize:
    result = (Normalize.normalizeSites(result.data))

    Object.assign(store, result);
    
    //Get Feed for 
    result = await API.getFeed( 20, 1, "roosterTeeth", "Episode", authToken);
    // deepLog(result)
    //Normalize
    result = (Normalize.normalizeFeed(result));
    Object.assign(store, result);


    //getShows
    result = await API.getShows( 10, 1, "roosterTeeth", authToken ); 
    result = Normalize.normalizeShows(result);


    //getSeasons 
    result = await API.getSeasons(10, 10, 1, authToken);
    // deepLog(Normalize.normalizeSeasons(result));


    //getEpisodes
    result = await API.getEpisodes(457, 10, 1, authToken);
    deepLog(Normalize.normalizeEpisodes(result));

    //getEpisodeInfo
    result = await API.getEpisodeInfo( 30552 , authToken ); 
    deepLog(result);


}

main();

/*
Notes:
There is an 'xbox' endpoint - This is used for getting the channels. 

Seeing as the whole API is meant to change soon^TM, I see no point in completely rewriting to support it now (although it does seem more efficient) 


User-ID; Is sent as a header: X-User-Id

User details can be got via /api/v1/users/${id}


*/