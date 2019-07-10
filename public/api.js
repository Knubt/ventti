const host = '';
const protocol = '';
const path = '/api/v1/game';

export async function sendAction(gameId, action) {
    const url = protocol + host + path + '/' + gameId;

    const reqData = {
        action: action
    }
    
    let respData;

    try {
        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqData)
        });

        if (!response.ok) {
            const error = new Error('Request to server failed');
            error.status = response.status;
            throw (error);
        }
        respData = await response.json();
    } catch (e) {
        console.log(e);
        return;
    }
    console.log(action);

    return respData;
}

export async function getNewGame() {
    const url = protocol + host + path;
    let data;

    try {
        const response = await fetch(url, { method: 'post' });
        if (!response.ok) {
            const error = new Error('Request to server failed');
            error.status = response.status;
            throw (error);
        }
        data = await response.json();
    } catch (e) {
        console.log(e);
        return;
    }
    return data;
}

export async function getCurrentGame(gameId) {
    const url = protocol + host + path + '/' + gameId;
    let data;

    try {
        const response = await fetch(url, { method: 'get' });
        if (!response.ok) {
            const error = new Error('Request to server failed');
            error.status = response.status;
            throw (error);
        }
        data = await response.json();
    } catch (e) {
        console.log(e);
        return;
    }
    return data;
}
