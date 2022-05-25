export type Snowflake = string;
export interface WebhookPayload {
  /**
   * The bot that got voted
   */
  bot: Snowflake;
  /**
   * The user that voted
   */
  user: Snowflake;
  /**
   * The type of vote
   */
  type: string;
}

declare module "radarbots.js" {}

declare module "express" {
  export interface Request {
    vote?: WebhookPayload;
  }
}
