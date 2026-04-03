export interface Goods {
    idx: number;
    goodsCode: string;
    name: string;
    price: number;
    imgUrl: string;
    team: string;
    pointRate: number;
    description: string;
}

export interface CartDto {
    goodsCode: string;
    name: string;
    price: number;
    imgUrl: string; 
    team: string;
    description: string;
    count: number;
    star: number;
    stock: number;
    onSale: boolean;
}

export interface Receipt {
    receiptCode: string;
    userId: string; 
    payment: string;
    payId: string;
    totalPrice: number;
    status: boolean;
    receiptDesc: string;
    createdAt: string;
    canceledAt: string;
}

export interface PurchaseDto {
    goodsCode: string;
    name: string;
    count: number;
    imgUrl: string;
    price: number;
}

export interface paymentDto {
    tid: string;
    next_redirect_pc_url: string;
    createdAt: string;
}

export interface GoodsDetailResponse {
    result: Goods;
}

export interface GoodsListResponse {
    result: Goods[];
    totalCount: number;
}

export interface CartListResponse {
    result: CartDto[];
}

export interface ReceiptListResponse {
    result: Receipt[];
}

export interface ReceiptDetailResponse {
    result: PurchaseDto[];
}

export interface PaymentResponse {
    result: paymentDto;
}