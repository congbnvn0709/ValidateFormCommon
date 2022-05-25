export interface BusinessManagement{
    stt?: number
    businessId?: number
    businessType?: string
    businessCode?: string
    businessName?: string
    scenario? : string
    frequencyInDay?: number
    status?: string
    createdBy? : string
    createDate?: Date
    updater? : string
    updateDate?: Date
}
export interface ListAttributeManagement{
    stt?: number
    attCode?: string
    attId?: number
    attName?: string
    attValue?: any
    businessDetailId?: number
}
