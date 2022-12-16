export interface iItem{
    id: number,
    articul: string,
    articulWb: string,
    title: string,
    shortTitle: string,
    brand: string,
    type: string,
    color: string,
    size: string,
    barcode: string,
    chrtId: number,
    costs: number | string,
    photo: string,
}

export interface iFullItem extends iItem{
    photoList: string [],
    newPhotoList: string [],
    stickerSize: string,
    stickerContains: string,
    stickerCountry: string,
    stickerManufacturer: string,
    stickerAddress: string
}