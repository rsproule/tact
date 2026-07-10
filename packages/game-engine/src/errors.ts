export type GameRuleErrorCode =
  | "invalid_settings"
  | "invalid_state"
  | "invalid_context"
  | "invalid_command"
  | "game_not_in_lobby"
  | "game_not_active"
  | "game_not_ended"
  | "game_full"
  | "not_enough_players"
  | "already_joined"
  | "principal_not_allowed"
  | "insufficient_buy_in"
  | "player_not_found"
  | "not_authorized"
  | "owner_authorization_required"
  | "ambiguous_actor"
  | "tank_dead"
  | "tank_alive"
  | "invalid_position"
  | "position_occupied"
  | "board_full"
  | "out_of_range"
  | "insufficient_action_points"
  | "insufficient_hearts"
  | "overkill"
  | "zero_value_gift"
  | "self_gift_not_supported"
  | "dead_tank_requires_heart"
  | "drip_too_early"
  | "already_dripped"
  | "already_voted"
  | "voting_closed"
  | "heart_spawn_not_ready"
  | "delegate_already_authorized"
  | "delegate_cannot_delegate"
  | "treaty_invalid"
  | "treaty_expired"
  | "treaty_active"
  | "bounty_not_found"
  | "bounty_closed"
  | "bounty_not_accepted"
  | "no_bounty_credit"
  | "not_on_podium"
  | "reward_already_claimed";

export class GameRuleError extends Error {
  readonly code: GameRuleErrorCode;
  readonly details: Readonly<Record<string, unknown>>;

  constructor(
    code: GameRuleErrorCode,
    message: string,
    details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
    this.name = "GameRuleError";
    this.code = code;
    this.details = details;
  }
}

export function fail(
  code: GameRuleErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): never {
  throw new GameRuleError(code, message, details);
}

export function isGameRuleError(error: unknown): error is GameRuleError {
  return error instanceof GameRuleError;
}
