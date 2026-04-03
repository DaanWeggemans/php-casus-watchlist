import { Cookie } from "../interfaces/cookie";

export function getCookie(name: string) {
    const cookie: Cookie | undefined = document.cookie.split("&")
        .map(cookie => {
            const array = cookie.split("=");
            return {
                name: array[0],
                value: array[1]
            } as Cookie;
        })
        .find(cookie => cookie.name == name);
    return cookie;
}