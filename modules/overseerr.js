class Overseerr {
    constructor() {}

    async lookup(movieName, movieYear) {
        try {
            const response = await fetch(`${process.env.OVERSEERR_URL}/api/v1/search?query=${encodeURIComponent(movieName)}%20(${movieYear})`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.OVERSEERR_API_KEY
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error in lookup method:', error);
            throw error;
        }
    }

    async add(movieName, movieYear) {
        try {
            const lookup = await this.lookup(movieName, movieYear);

            if (!lookup || lookup.length === 0) {
                return this.generateResponseStructure(false, 'No results found', movieName, movieYear);
            }

            const request = this.buildRequestObject(lookup[0]);

            if (typeof request.mediaId !== 'undefined') {
                let msg = 'Movie already exists in Overseerr';
                if (!request.hasFile && request.isAvailable && process.env.OVERSEERR_FORCE_SEARCH_ON_EXISTING === 'true') {
                    msg = 'Movie exists but is not downloaded. Forcing a search in Overseerr.';
                    const url = `${process.env.OVERSEERR_URL}/api/v1/request`;
                    const postdata = {
                        "mediaId": request.mediaId,
                        "mediaType": "movie"
                    };
                    console.log('Sending post request to:', url);
                    console.log('Post data:', postdata);
                    const response = await fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(postdata),
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Api-Key': process.env.OVERSEERR_API_KEY
                        }
                    });
                }

                return this.generateResponseStructure(false, msg, request.title, request.year, request.imdbId, request.tmdbId);
            }

            const response = await this.sendMovieToOverseerr(request);

            if (response.status === 201) {
                return this.generateResponseStructure(true, 'Movie added to Overseerr', request.title, request.year, request.imdbId, request.tmdbId);
            }

            const errors = await response.json();
            return this.generateResponseStructure(false, 'Error adding movie to Overseerr', request.title, request.year, request.imdbId, request.tmdbId, errors);

        } catch (error) {
            console.error('Error in add method:', error);
            return this.generateResponseStructure(false, 'Unexpected error occurred');
        }
    }

    async bulkAdd(movieList) {
        let results = [];
        for (const movie of movieList) {
            const result = await this.add(movie.title, movie.year);
            results.push(result);
        }
        return results;
    }

    generateResponseStructure(success, message, title = '', year = '', imdbId = '', tmdbId = '', errors = null) {
        return {
            success,
            message,
            title,
            year,
            imdbId,
            tmdbId,
            errors
        };
    }

    buildRequestObject(lookupResult) {
        return {
            mediaId: lookupResult.id,
            title: lookupResult.title,
            year: lookupResult.year,
            imdbId: lookupResult.imdbId,
            tmdbId: lookupResult.tmdbId,
            hasFile: lookupResult.hasFile,
            isAvailable: lookupResult.isAvailable,
            qualityProfileId: process.env.OVERSEERR_QUALITY_PROFILE_ID,
            profileId: process.env.OVERSEERR_QUALITY_PROFILE_ID,
            monitored: true,
            minimumAvailability: 'released'
        };
    }

    async sendMovieToOverseerr(request) {
        console.log('Sending movie to Overseerr:', request.title);
        const url = `${process.env.OVERSEERR_URL}/api/v1/request`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                mediaId: request.mediaId,
                mediaType: 'movie'
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': process.env.OVERSEERR_API_KEY
            }
        });
    }
}

export default new Overseerr();
