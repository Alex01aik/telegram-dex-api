import { BadRequestException, Injectable, Logger } from '@nestjs/common';

const wrapperSolAddress = 'So11111111111111111111111111111111111111112';

@Injectable()
export class DexService {
  private readonly logger = new Logger(DexService.name);

  constructor() {}

  async getInfoByAddress(address: string) {
    const poolUrl =
      process.env.DEX_API_URL +
      `pools/info/mint?mint1=${address}` +
      `&mint2=&poolType=standard&poolSortField=default&sortType=desc&pageSize=1&page=1`;

    const priceUrl =
      process.env.DEX_API_URL +
      `mint/price?mints=${wrapperSolAddress},${address}`;

    try {
      const res = await fetch(poolUrl);
      const data = await res.json();
      if (!data.data?.data?.length) {
        throw new BadRequestException(
          `The address "${address}" is not supported by ${process.env.DEX_API_URL}`,
        );
      }

      const priceRes = await fetch(priceUrl);
      const priceData = await priceRes.json();

      if (!priceData.data) {
        throw new BadRequestException(
          `The error of getting "${address}" asset price by ${process.env.DEX_API_URL}`,
        );
      }

      const assetInfo = data.data?.data?.[0];
      const assetPriceData = priceData.data;

      return {
        name: assetInfo.mintB.symbol ?? assetInfo.mintB.name ?? '',
        fullName: assetInfo.mintB.name ?? '',
        logo: assetInfo.mintB.logoURI ?? '',
        price: assetInfo.price ?? 0,
        priceInUsd: assetPriceData[address],
        priceSolInUsd: assetPriceData[wrapperSolAddress],
      };
    } catch (error) {
      this.logger.error(`Fetch asset info error: ${error}`);
    }
  }
}
