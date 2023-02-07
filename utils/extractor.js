const playdl = require("play-dl");
const fetch = require("node-fetch");
const { getData, getPreview, getTracks } = require('spotify-url-info')(fetch);
const Youtube = require("youtube-sr").default;

// poorly written code (just like the whole project), might improve this soon

module.exports = {
    important: true,
    validate: () => true, // true, since we're also using this for searches when query isnt a valid link
    getInfo: async (query) => {
        return new Promise(async (resolve, reject) => {
            try {
                // ---- start soundcloud ----
                if (["track", "playlist"].includes(await playdl.so_validate(query))) {
                    const info = await playdl.soundcloud(query);
                    if (info.type === "track") {
                        const track = {
                            title: info.name,
                            duration: info.durationInMs,
                            thumbnail: info.thumbnail,
                            async engine() {
                                return (await playdl.stream(info.url, { discordPlayerCompatibility : true })).stream;
                            },
                            views: 0,
                            author: info.publisher ? info.publisher.name ?? info.publisher.artist ?? info.publisher.writer_composer ?? null : null,
                            description: "",
                            url: info.permalink,
                            source: "soundcloud-custom"
                        };
                        return resolve({ playlist: null, info: [track] });
                    } else if (info.type === "playlist") {
                        const trackList = await info.all_tracks();
                        const tracks = await trackList.map(track => {
                            return {
                                title: track.name,
                                duration: track.durationInMs,
                                thumbnail: track.thumbnail,
                                async engine() {
                                    return (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;
                                },
                                views: 0,
                                author: track.publisher ? track.publisher.name ?? track.publisher.artist ?? track.publisher.writer_composer ?? null : null,
                                description: "",
                                url: track.permalink,
                                source: "soundcloud-custom"
                            }
                        });
                        const playlist = {
                            title: info.name,
                            description: "",
                            thumbnail: null,
                            type: "playlist",
                            source: "soundcloud-custom",
                            author: info.user,
                            id: info.id,
                            url: info.url,
                            rawPlaylist: info
                        }
                        return resolve({ playlist: playlist, info: tracks });
                    }
                }
                // ---- end soundcloud ----

                // ---- start spotify ----
                if (query.includes("open.spotify.com") || query.includes("play.spotify.com")) {
                    const info = await getPreview(query);
                    if (info.type === "track") {
                        const spotifyTrack = await getData(query);
                        const track = {
                            title: info.title,
                            duration: spotifyTrack.duration_ms,
                            thumbnail: info.image,
                            async engine() {
                                return (await playdl.stream(await Youtube.search(`${info.artist} ${info.title} lyric`, {limit: 1, type: "video", safeSearch: true}).then(x => x[0] ? `https://youtu.be/${x[0].id}` : `https://youtu.be/Wch3gJG2GJ4`), { discordPlayerCompatibility : true })).stream;
                            },
                            views: 0,
                            author: info.artist,
                            description: "",
                            url: info.link,
                            source: "spotify-custom"
                        };
                        return resolve({ playlist: null, info: [track] });
                    } else if (["album", "artist", "playlist"].includes(info.type)) {
                        const trackList = await getTracks(query);
                        const tracks = trackList.map(track => {
                            return {
                                title: track.name,
                                duration: track.duration_ms,
                                thumbnail: track.album && track.album.images.length ? track.album.images[0].url : null,
                                async engine() {
                                    return (await playdl.stream(await Youtube.search(`${track.artists[0].name} ${track.name} lyric`, {limit: 1, type: "video", safeSearch: true}).then(x => x[0] ? `https://youtu.be/${x[0].id}` : `https://youtu.be/Wch3gJG2GJ4`), { discordPlayerCompatibility : true })).stream;
                                },
                                views: 0,
                                author: track.artists ? track.artists[0].name : null,
                                description: "",
                                url: track.external_urls.spotify,
                                source: "spotify-custom"
                            }
                        });
                        const playlist = {
                            title: info.title,
                            description: "",
                            thumbnail: info.image,
                            type: info.type === "album" ? "album" : "playlist",
                            source: "spotify-custom",
                            author: info.artist,
                            id: null,
                            url: info.link,
                            rawPlaylist: info
                        }
                        return resolve({ playlist: playlist, info: tracks });
                    }
                }
                // ---- end spotify ----

                if (query.startsWith("https")) {
                    query = query.split("&")[0];
                }
                if (query.startsWith("https") && playdl.yt_validate(query) === "video") {
                    const info = await Youtube.search(query, {limit: 1, type: "video", safeSearch: true});
                    if(!info || !info.length) 
                        return resolve({ playlist: null, info: null });
                    
                    const track = {
                        title: info[0].title,
                        duration: info[0].duration,
                        thumbnail: info[0].thumbnail ? info[0].thumbnail.url : null,
                        async engine() {
                            return (await playdl.stream(`https://youtu.be/${info[0].id}`, { discordPlayerCompatibility : true })).stream;
                        },
                        views: info[0].views,
                        author: info[0].channel.name,
                        description: "",
                        url: `https://youtu.be/${info[0].id}`,
                        source: "youtube-custom"
                    };
                    return resolve({ playlist: null, info: [track] });
                } else if (playdl.yt_validate(query) === "playlist") {
                    const info = await playdl.playlist_info(query, { incomplete: true });
                    const trackList = await info.all_videos();
                    const tracks = trackList.map(track => {
                        return {
                            title: track.title,
                            duration: track.durationInSec * 1000,
                            thumbnail: track.thumbnails ? track.thumbnails[0] ? track.thumbnails[0].url : null : null,
                            async engine() {
                                return (await playdl.stream(await Youtube.search(track.url, {limit: 1, type: "video", safeSearch: true}).then(x => x[0] ? `https://youtu.be/${x[0].id}` : `https://youtu.be/Wch3gJG2GJ4`), { discordPlayerCompatibility : true })).stream;
                            },
                            views: track.views,
                            author: track.channel.name,
                            description: "",
                            url: track.url,
                            source: "youtube-custom"
                        }
                    });
                    const playlist = {
                        title: info.title,
                        description: "",
                        thumbnail: info.thumbnail ? info.thumbnail.url : null,
                        type: "playlist",
                        source: "youtube-custom",
                        author: info.channel.name,
                        id: info.id,
                        url: info.url,
                        rawPlaylist: info
                    }
                    return resolve({ playlist: playlist, info: tracks });
                }

                const search = await Youtube.search(query, { limit: 5, type: "video", safeSearch: true });

                if(search && search.length) {
                    const tracks = search.map(track => {
                        return {
                            title: track.title,
                            duration: track.duration,
                            thumbnail: track.thumbnail ? track.thumbnail.url : null,
                            async engine() {
                                return (await playdl.stream(`https://youtu.be/${track.id}`, { discordPlayerCompatibility : true })).stream;
                            },
                            views: track.views,
                            author: track.channel.name,
                            description: "",
                            url: `https://youtu.be/${track.id}`,
                            source: "youtube-custom"
                        }
                    });
                    return resolve({ playlist: null, info: tracks });
                }

                return resolve({ playlist: null, info: null });
            } catch(error) {
                console.log(`Extractor: An error occurred while attempting to resolve ${query} :\n${error}`);
                return resolve({ playlist: null, info: null });
            }
        });
    }
};