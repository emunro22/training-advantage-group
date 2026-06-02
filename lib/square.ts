import { SquareClient, SquareEnvironment } from "square";

let _client: SquareClient | null = null;

export function getSquareClient(): SquareClient {
  if (!_client) {
    _client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN ?? "",
      environment: SquareEnvironment.Production,
    });
  }
  return _client;
}

export const DEPOSIT_AMOUNT_PENCE = 5000; // £50 deposit
export const DEPOSIT_THRESHOLD_PENCE = 7500; // Only offer deposit when total > £75
