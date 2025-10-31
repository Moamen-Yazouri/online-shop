export const  destructToken = (bearerHeader: string) => {
    return bearerHeader.split(' ')[1];
}