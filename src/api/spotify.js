import store from 'store';
import remoteControl from 'game/loops/remoteControl';
import executeAction from 'engine/executeAction';
import createNotification, { dismissNotification } from 'engine/createNotification';

const authorizationUrl = 'https://accounts.spotify.com/authorize';
const baseUrl = 'https://api.spotify.com/v1';
const clientId = 'a1f5fd4ba8404b84b77fc4f98b3be015';
const scope = 'user-top-read, user-read-playback-state, user-modify-playback-state';
const redirectUrl = window.location.protocol + '//' + window.location.host;
let accessToken = window.sessionStorage.getItem('spotifyAccessToken');

let favoriteArtists = null;
let tracks = {};
let device = null;

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function now() {
    return (new Date()).getTime();
}

async function wait(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}

async function waitUntil(time) {
    const duration = time - now();
    await wait(duration);
}

export function authorize() {
    // Check if already authorized
    if (accessToken) return;
    
    // Authorize
    window.sessionStorage.setItem('returnUrl', window.location.href);
    window.location.href = authorizationUrl +
        '?response_type=token' +
        '&client_id=' + clientId +
        '&scope=' + scope +
        '&redirect_uri=' + encodeURIComponent(redirectUrl);
}

export function catchAuthorization() {
    // Get the first hash parameter which should contain returned access token
    var param = window.location.hash
        .slice(1)
        .split('&')[0]
        .split('=')
        .map(decodeURIComponent);
    if (param[0] !== 'access_token') return;

    // Save access token
    window.location.hash = '';
    accessToken = param[1];
    window.sessionStorage.setItem('spotifyAccessToken', accessToken);

    // Go to return url if it was saved
    const returnUrl = window.sessionStorage.getItem('returnUrl');
    if (returnUrl) {
        window.sessionStorage.removeItem('returnUrl');
        window.location.href = returnUrl;
    }
}

export function reauthorize() {
    accessToken = null;
    window.sessionStorage.removeItem('spotifyAccessToken');
    authorize();
}

export async function request(method, endpoint, params = {}) {
    const url = new URL(baseUrl + '/' + endpoint);

    let body;
    if (method === 'GET') {
        for (const key in params) {
            if (!params.hasOwnProperty(key)) continue;
            const value = params[key];
            url.searchParams.append(key, value);
        }
    } else {
        body = JSON.stringify(params);
    }

    const response = await fetch(url, {
        method,
        body,
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    });
    let result;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') === 0) {
        result = await response.json();
    } else {
        result = await response.text();
    }
    
    if (result.error)
    {
        if (result.error.status === 401) {
            reauthorize();
        }
        throw new Error('Spotify Web API Error: ' + result.error.message);
    }

    return result;
}

export async function getFavoriteArtists() {
    favoriteArtists = (await request('GET', 'me/top/artists', { limit: 5 }))
        .items.map(artist => artist.id);
}

export async function getDevice() {
    const response = await request('GET', 'me/player/devices');
    return new Promise((resolve, reject) => {
        const selectionTriggers = [];
        for (const dev of response.devices) {
            if (dev.is_active) {
                resolve(device = dev.id);
                return;
            }

            const deviceTrigger = async () => {
                dismissNotification(notification1);
                dismissNotification(notification2);
                resolve(device = dev.id);
            };
            deviceTrigger.label = dev.name;
            selectionTriggers.push(deviceTrigger);

            console.count('device');
        }

        const refreshTrigger = async () => {
            dismissNotification(notification1);
            dismissNotification(notification2);
            getDevice().then(resolve).catch(reject);
        };
        refreshTrigger.label = 'Refresh';
        selectionTriggers.push(refreshTrigger);

        const cancelTrigger = async () => {
            dismissNotification(notification1);
            dismissNotification(notification2);
            reject('Device selection cancelled');
        };
        cancelTrigger.label = 'Cancel';
        selectionTriggers.push(cancelTrigger);

        const notification1 = createNotification('Select Spotify playback device', {
            autoDismiss: false
        });
        const notification2 = createNotification('If the wanted device is missing, open Spotify on that device and click refresh', {
            autoDismiss: false
        });
        executeAction(async () => selectionTriggers);
    });
}

export async function synchronize() {
    remoteControl.pause();

    // Get playing context
    const playing = await request('GET', 'me/player');
    if (!playing.item || !tracks[playing.item.id]) return false;

    // Calculate progress of song in seconds taking in account time dilation
    const progress = (playing.progress_ms + (now() - playing.timestamp)) / 1000;

    // Wait for the next beat
    const analysis = tracks[playing.item.id].analysis;
    for (const beat of analysis.beats) {
        if (beat.start < progress) continue;
        const beatStart = now() + (beat.start - progress) * 1000;
        await waitUntil(beatStart);
        break;
    }

    remoteControl.play();
}

export async function findPlaySync(waitForSync = true) {
    remoteControl.pause();

    const { strokeSpeed } = store.game;
    const tempo = Math.round(strokeSpeed * 60);
    if (tempo === 0) return false;

    // Find suitable track
    if (!favoriteArtists) await getFavoriteArtists();
    const recommendations = await request('GET', 'recommendations', {
        limit: 1,
        seed_artists: favoriteArtists.join(','),
        target_tempo: tempo,
    });
    const track = recommendations.tracks[0];
    track.analysis = await request('GET', 'audio-analysis/' + track.id);
    tracks[track.id] = track;

    // Select suitable sections and pick one
    const suitableSections = [];
    for (const section of track.analysis.sections) {
        if (Math.abs(section.tempo - tempo) < 5) {
            suitableSections.push(section);
        }
    }
    let section;
    if (suitableSections.length > 0) section = pickRandom(suitableSections);
    else section = pickRandom(track.analysis.sections);

    // Find device
    if (!device) await getDevice();

    // Start playing the section
    const trackUri = 'spotify:track:' + track.id;
    await request('PUT', 'me/player/play?device_id=' + encodeURIComponent(device), {
        uris: [trackUri],
        position_ms: section.start * 1000,
    });
    
    // Make sure playback has started by waiting a bit
    await wait(150);

    // Synchronize
    const synchronization = synchronize();
    if (waitForSync) return await synchronization;

    return true;
}