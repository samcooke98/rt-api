import * as API from "../src/API.js"
require('dotenv').config();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 1000; 


describe("The API functions", () => {
    let authToken = ""
    describe("The Login Function", () => {
        it("should error", () => {
            API.login("siasdkd", "sdiaksdo").then((val) => {
                expect(result).toContain({ error: 'invalid_credientals' })
            });

        })

        it("should work, (valid account - prod)", async () => {
            let result = await API.login(process.env.RT_USERNAME, process.env.RT_PASSWORD)
            expect(result).not.toContain({ error: 'invalid_credientals' });
            authToken = result.access_token
        })
    })

    describe("The Feed Function", () => {
        it(" should fail ( no auth-token ) ", async () => {
            let result = await API.getFeed(20, 1, "RoosterTeeth", "Episode", '');
            expect(result).toHaveProperty("error", "invalid_request");
        })

        it("should work - should contain 20 entries", async () => {
            let result = await API.getFeed(20, 1, "RoosterTeeth", "Episode", authToken);
            // expect(result).toHaveProperty( "error", "invalid_request" );
            expect(result).toHaveLength(20);
        })

    })

    describe("The Shows Function", () => {
        it(" should fail ( no auth-token ) ", async () => {
            let result = await API.getShows(20, 1, "RoosterTeeth", '');
            expect(result).toHaveProperty("error", "invalid_request");
        })

        it("should work - should contain 20 entries", async () => {
            let result = await API.getShows(20, 1, "RoosterTeeth", authToken);
            // expect(result).toHaveProperty( "error", "invalid_request" );
            expect(result).toHaveLength(20);
            //TODO: Should really expect that these are type: Shows
            // expect(result).toContain()
        })
    })

    //Seasons
    describe("The Seasons Function", () => {
        it(" should fail ( no auth-token ) ", async () => {
            let result = await API.getSeasons(20, 20, 1, '');
            // The RT API is inconsistent as. Instead of erroring, it just returns nothing 
            expect(result).toHaveLength(0);
        })
        let result;
        it("should work - should contain 20 entries", async () => {
            result = await API.getSeasons(20, 20, 1, authToken);
            // expect(result).toHaveProperty( "error", "invalid_request" );
            expect(result).not.toHaveProperty("error");

        })
    })

    //Episodes
    describe("The Episodes Function", () => {
        it(" should fail ( no auth-token ) ", async () => {
            let result = await API.getEpisodes(20, 20, 1, '');
            expect(result).toHaveProperty("error");
        })
        it("should work", async () => {
            let result = await API.getEpisodes(20, 20, 1, authToken);
            // expect(result).toHaveProperty( "error", "invalid_request" );
            expect(result).not.toHaveProperty("error");
            expect(result).not.toHaveLength(0);

        })
    })
    //EpisodeInfo
    describe("The Episode Info", () => {
        it("should fail (no auth-token)", async () => {
            let result = await API.getEpisodeInfo(123, '');
            expect(result).toHaveProperty('error');
        })

        it("should work",async  () => {
            let result = await API.getEpisodeInfo(123, authToken);
            expect(result).not.toHaveProperty('error');
        })
    })

    //getSites


})