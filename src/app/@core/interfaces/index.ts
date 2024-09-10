export interface ConfirmModel {
  title?: string;
  data?: any;
  message?: boolean | string;
  iframeUrl?:string;
  className?: string;
  info?: string;
}
export interface FontModel
{
  FontFamily:string;
  Type:string;
  Weight:string;
  Src:string;
}

export interface Region
{
  Id:number;
  Name:string;
  IsoCode:string;
  IsoCode3:string;
}
export interface Language
{
  key:string;
  value:string;
}

export interface CasinoFilterModel
{
  pageIndex:number;
  pageSize:number;
  categoryId:number;
  providers:any[];
  categories:any[];
  gamePattern:string;
  concatData:boolean;
}

export interface TimeZone
{
  abbr:string;
  text:string;
  value:string;
  isdst:boolean;
  offset:number;
  utc:string[];
  utcText:string;
}

export interface Bank
{
  Id:number;
  BankCode:string;
  BankName:string;
  OwnerName:string;
  Accounts:BankAccount[];
}

export interface BankAccount
{
  BankAccountNumber:number;
  IBAN:string;
  OwnerName:string;
}
