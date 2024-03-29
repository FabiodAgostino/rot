import { RolesDiscord } from "../utils/utility";

export class TokenDiscord {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires: Date = new Date();

  constructor(
    token: string,
    expires: number,
    refresh: string,
    scope: string,
    token_type: string
  ) {
    this.access_token = token;
    this.expires_in = expires;
    this.refresh_token = refresh;
    this.scope = scope;
    this.token_type = token_type;
  }
}

export class GuildDiscord {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: string;
  features: string[];

  constructor(
    id: string,
    name: string,
    icon: string,
    owner: boolean,
    permissions: string,
    features: string[]
  ) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.owner = owner;
    this.permissions = permissions;
    this.features = features;
  }
}

export class UserDiscord {
  constructor(
    avatar: any,
    communication_disabled_until: any,
    flags: number,
    joined_at: string,
    nick: string,
    pending: boolean,
    premium_since: any,
    roles: string[],
    user: PartialUserDiscord,
    mute: boolean,
    deaf: boolean
  ) {
    this.avatar = avatar;
    this.communication_disabled_until = communication_disabled_until;
    this.flags = flags;
    this.joined_at = joined_at;
    this.nick = nick;
    this.pending = pending;
    this.premium_since = premium_since;
    this.roles = roles;
    this.user = user;
    this.mute = mute;
    this.deaf = deaf;
  }
  avatar: any;
  communication_disabled_until: any;
  flags: number;
  joined_at: string;
  nick: string;
  pending: boolean;
  premium_since: any;
  roles: string[];
  user: PartialUserDiscord;
  mute: boolean;
  deaf: boolean;
}

export class FullUserDiscord
{
  constructor(user?: UserDiscord, guildId?:string, guildName?:string, token?:TokenDiscord,ruoli?:string[], isValidatore?:boolean)
  {
      this.id=user!.user.id;
      this.username=user!.user.username;
      this.ruoli = ruoli;
      this.roles=user!.roles;
      this.guildId = guildId;
      this.guildName = guildName;
      this.serverAutenticazione = guildName;
      this.token=token;
      this.isValidatore=isValidatore;
  }
  id?: string;
  username?: string;
  ruoli?: string[];
  roles?: string[];
  interno: boolean=false;
  token?: TokenDiscord;
  lastExpiresToken: any;
  serverAutenticazione?: string;
  registratoDate: any;
  revokeToken: any;
  guildId?:string;
  guildName?:string;
  isValidatore?:boolean;
}

export class PartialUserDiscord {
  constructor(
    id: string,
    username: string,
    global_name: any,
    display_name: any,
    avatar: string,
    discriminator: string,
    public_flags: number,
    avatar_decoration: any
  ) {
    this.id = id;
    this.username = username;
    this.global_name = global_name;
    this.display_name = display_name;
    this.avatar = avatar;
    this.discriminator = discriminator;
    this.public_flags = public_flags;
    this.avatar_decoration = avatar_decoration;
  }
  id: string;
  username: string;
  global_name: any;
  display_name: any;
  avatar: string;
  discriminator: string;
  public_flags: number;
  avatar_decoration: any;
}


export interface UserMeDiscord {
  id:                string;
  username:          string;
  global_name:       any;
  display_name:      any;
  avatar:            string;
  discriminator:     string;
  public_flags:      number;
  flags:             number;
  banner:            any;
  banner_color:      string;
  accent_color:      number;
  locale:            string;
  mfa_enabled:       boolean;
  premium_type:      number;
  avatar_decoration: any;
  email:             string;
  verified:          boolean;
}

export class RuoloDiscord {

  constructor(id?: string, name?: string, color?: number) {
  }
}

export class ServerDiscord
{
  constructor(public id?:string, public name?:string, public date?:any) {
  }
}

export class RuoloTipoRuolo
{
  constructor(public guildId?:string, public role?:string, public tipoRuolo?:string, public idRole?:string, public isValidatore:boolean=false, public username?:string) {
  }
}

export class FullServerDiscord implements ServerDiscord
{
  constructor(public ruoli?: RuoloTipoRuolo[],public id?:string, public name?:string, public date?:any) {
  }
}


