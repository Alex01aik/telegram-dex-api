import { BadRequestException, Injectable, Logger } from '@nestjs/common';

const wrapperSolAddress = 'So11111111111111111111111111111111111111112';
// TODO with flag
const fakePrices = [2, 4, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 1, 1];

@Injectable()
export class DexService {
  private readonly logger = new Logger(DexService.name);
  private fakeIterator = 0;

  constructor() {}

  async getInfoByAddress(address: string) {
    const poolUrl =
      process.env.DEX_API_URL +
      `pools/info/mint?mint1=${address}` +
      `&mint2=&poolType=standard&poolSortField=default&sortType=desc&pageSize=1&page=1`;

    try {
      const res = await fetch(poolUrl);
      const data = await res.json();
      if (!data.data?.data?.length) {
        throw new BadRequestException(
          `The address "${address}" is not supported by ${process.env.DEX_API_URL}`,
        );
      }

      // TODO if need price in usd
      // const priceUrl =
      //   process.env.DEX_API_URL +
      //   `mint/price?mints=${wrapperSolAddress},${address}`;
      // const priceRes = await fetch(priceUrl);
      // const priceData = await priceRes.json();

      // if (!priceData.data) {
      //   throw new BadRequestException(
      //     `The error of getting "${address}" asset price by ${process.env.DEX_API_URL}`,
      //   );
      // }

      // const assetPriceData = priceData.data;

      const assetInfo = data.data?.data?.[0];

      // TODO ADD FEATURE FLAG FOR TEST
      // const fakePrice = fakePrices[this.fakeIterator];
      // this.fakeIterator++;

      return {
        name: assetInfo.mintB.symbol ?? assetInfo.mintB.name ?? '',
        fullName: assetInfo.mintB.name ?? '',
        logo: assetInfo.mintB.logoURI ?? '',
        price: assetInfo.price ?? 0,
        // price: fakePrice.toString(),
        liquidity: assetInfo.tvl ?? 0,
      };
    } catch (error) {
      this.logger.error(`Fetch asset info error: ${error}`);
    }
  }
}
