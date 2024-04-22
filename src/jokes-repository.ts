import source from './jokes.json';
import { Joke, Limits } from './types';

const jokes: Joke[] = source.map((text, index) => ({
  id: index + 1,
  text,
}));

export const getJokeById = (jokeId: number) => {
  return Promise.resolve(jokes[jokeId - 1]);
};

export const getLimits = () => {
  return Promise.resolve<Limits>({ oldest: jokes[0].id, newest: jokes[jokes.length - 1].id });
};

export const getMatchingJoke = (filter: string, offset: number) => {
  const parsedFilter = parseSearchText(filter);
  const matchingJokes = jokes.filter((joke) =>
    joke.text.some((paragraph) => parseSearchText(paragraph).indexOf(parsedFilter) > -1),
  );
  const matchingJoke = matchingJokes[offset];

  return matchingJoke
    ? Promise.resolve(matchingJoke)
    : Promise.reject({
        message: offset > 0 ? `No hay más bromas con "${filter}"` : `No hay bromas con "${filter}"`,
      });
};

const parseSearchText = (text: string) =>
  text
    .toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u');
