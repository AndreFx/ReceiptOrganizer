//Utilities

export function checkResponseStatus(response) {
    if (response.status != 200) {
        throw new Error('Bad Response from Server');
    }
}