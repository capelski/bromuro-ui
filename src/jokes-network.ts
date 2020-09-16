import { config } from './config';
import { Joke } from './types';

export const getNetworkJoke = (consumedIds: number[], filter?: string, offset?: number) => {
    let relativeUrl: string;
    if (filter) {
        relativeUrl = `/jokes/match?text=${filter}${
            offset !== undefined ? `&offset=${offset}` : ''
        }`;
    } else {
        const randomJokeId = Math.floor(Math.random() * 324) + 1;
        relativeUrl = `/jokes/${randomJokeId}`;
    }
    const absoluteUrl = config.API_URL + relativeUrl;
    let response: Response;

    return (
        fetch(absoluteUrl)
            // Fetch might throw an exception if network is unavailable, DNS fails to resolve, etc.
            .catch((error) => {
                console.log(error);
                return {
                    ok: false,
                    json: () =>
                        Promise.resolve({
                            message: 'Vaya... algo no ha ido bien 🤦‍♂️'
                        })
                } as Response;
            })
            .then((_response) => {
                response = _response;
                return _response.json();
            })
            // response.json() might throw an exception if response doesn't contain JSON
            .catch((error) => {
                console.log(error);
                return { message: 'Vaya... algo no ha ido bien 🤦‍♂️' };
            })
            .then((responseJson) => {
                console.log('Request:', absoluteUrl);
                console.log('Response:', response.status);
                console.log(responseJson);

                if (response.ok) {
                    return responseJson as Joke;
                } else {
                    throw new Error(responseJson.message);
                }
            })
    );
};
