export interface iPageParams{
    search:      string,
    currentPage: number,
    onPage:      number,
    totalPages:  number,
    totalCount:  number,
    sort?:        string,
    order?:       string
}

export interface iOrdersPageParams extends iPageParams{
    viewType:string,
    checkNewOrders:number,
    supplyId: string,
    totalCountInSuplly:number
}

export interface iSupplyPageParams extends iPageParams{
    startDate:string,
    endDate:string,
    optionStr:string
}