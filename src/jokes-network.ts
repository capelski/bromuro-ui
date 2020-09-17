import { config } from './config';
import { Joke } from './types';

const useMockService = false && process.env.NODE_ENV !== 'production';

const networkRequest = (url: string) => {
    let response: Response;

    return (
        fetch(url)
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
                console.log('Request:', url);
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

export const getMatchingJoke = (filter: string, offset: number) => {
    const absoluteUrl =
        config.API_URL +
        `/jokes/match?text=${filter}${offset !== undefined ? `&offset=${offset}` : ''}`;
    return useMockService
        ? Promise.resolve({
              id: -1,
              text: ['Matching', 'joke', String(new Date().getMilliseconds())]
          })
        : networkRequest(absoluteUrl);
};

// TODO Use consumedIds
export const getRandomJoke = (_consumedIds: number[]) => {
    const randomJokeId = Math.floor(Math.random() * 324) + 1;
    const absoluteUrl = config.API_URL + `/jokes/${randomJokeId}`;
    return useMockService
        ? Promise.resolve({
              id: -1,
              text: ['Random', 'joke', String(new Date().getMilliseconds())]
          })
        : networkRequest(absoluteUrl);
};
