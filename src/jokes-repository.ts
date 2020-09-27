import { config } from './config';
import { Joke, Limits } from './types';

const useMockService = false && process.env.NODE_ENV !== 'production';

const networkRequest = <T>(url: string) => {
    let response: Response;

    return (
        fetch(url)
            // Fetch might throw an exception if network is unavailable, DNS fails to resolve, etc.
            .catch((error) => {
                console.warn(error);
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
                console.warn(error);
                return { message: 'Vaya... algo no ha ido bien 🤦‍♂️' };
            })
            .then((responseJson) => {
                console.log(response.status, '-', url);
                console.log(responseJson);

                if (response.ok) {
                    return responseJson as T;
                } else {
                    throw new Error(responseJson.message);
                }
            })
    );
};

export const getJokeById = (jokeId: number) => {
    const absoluteUrl = config.API_URL + `/jokes/${jokeId}`;
    return useMockService
        ? Promise.resolve({
              id: -1,
              text: ['Random', 'joke', String(new Date().getMilliseconds())]
          })
        : networkRequest<Joke>(absoluteUrl);
};

export const getLimits = () => {
    const absoluteUrl = config.API_URL + '/jokes/limits';
    return networkRequest<Limits>(absoluteUrl);
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
        : networkRequest<Joke>(absoluteUrl);
};
