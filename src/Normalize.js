
import { normalize, schema } from 'normalizr';

// const Site = new schema.Entity('site', {relationships: { shows: Show, episodes: Episode } } );
const Site = new schema.Entity('Site'); //Not Finished


const Show = new schema.Entity('shows')

const Season = new schema.Entity("season", {show: Show})

const Episode = new schema.Entity('episode', { show: Show, season: Season })

const User = new schema.Entity('User'); //Not Finished

const News = new schema.Entity('News'); //Not Finished

const FeedItem = new schema.Entity('Feed')


export function normalizeSites(data) {
    if (data.data) {
        console.warn("You probably meant to pass this function a .data attribute");
    }
    return normalize(data, [Site])
}

export function normalizeFeed(data) {
    //Really item: {type} is dependent on the value of type 

    return normalize(data, [{ type: "", item: Episode }])
}

export function normalizeShows(data){ 
    return normalize(data, [Show])
}


export function normalizeSeasons (data ) { 
    return normalize( data, [Season])
}

export function normalizeEpisodes( data) { 
    return normalize( data, [Episode])
}