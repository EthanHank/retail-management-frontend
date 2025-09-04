type Sale = {
  id: string
  saleDate: string
  productSales: ProductSale[]
}

type ProductSale = {
  qtySold: number
  products: {
    id: string
    productName: string
    stockQty: number
    sellingPrice: number
    profitPerItem: number
  }
  revenue: number
  profit: number
}

export type { Sale, ProductSale };

export type CreateSale = {
  productSales: ProductSaleInfo[];
};

export type ProductSaleInfo = {
  productId: string;
  qtySold: number;
};


