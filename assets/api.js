import axios from 'axios';
import config from "../http/config";
import { API_URL } from '../http/config';

export class Api {
    static async loginUser(username, password) {
        const response = await axios.post(API_URL + 'auth/login', {
            username, password
        })

        return response;
    }

    static async me(token) {
        const response = await axios.get(API_URL + 'auth/me', {
            headers: {
                Authorization: token
            }
        });

        return response
    }

    static async getFilms(id) {
        const films = await axios.get(API_URL + "films/getlist/v2/" + id);
        return films
    }

    static async addFilm(userId, filmId) {
        const imdbId = await kinopoiskApi.getImdbId(filmId);

        if (!imdbId) {
            const response = await this.addWithoutIMDB(userId, filmId);
            return response
        }

        const response = await axios.post(API_URL + 'films/add', { userId, imdbId })

        return response
    }

    static async addWithoutIMDB(userId, kinopoiskId) {
        const response = await axios.post(API_URL + 'films/addkinopoisk', { userId, kinopoiskId })

        return response
    }

    static async changeFilmStatus(userId, filmId, statusId) {
        const response = await axios.patch(API_URL + 'films/status', {
            userId, filmId, statusId
        })

        return response
    }
}

export class kinopoiskApi {
    static async getFilms(keyword) {
        const response = await axios.get(config.API_KINOPOISK_LINK + keyword, {
            headers: {
                "X-API-KEY": config.API_KINOPOISK_KEY,
                "Content-Type": 'application/json'
            }
        })

        return response
    }

    static async getImdbId(id) {
        const response = await axios.get(config.API_KINOPOISKID_LINK + id, {
            headers: {
                "X-API-KEY": config.API_KINOPOISK_KEY,
                "Content-Type": 'application/json'
            }
        })

        return response.data.imdbId
    }
}