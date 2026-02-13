import { request } from "./apiClient";

// Example TypeScript type for KOT items
export interface KotOrder {
  Count: number;
  Res: string;
  Tbl: string;
  Item: string;
  Qty: number;
  Cmnt: string | null;
  KotTime: string;
  KotNo: string;
  Barked: string;
  BarkedTime: string;
  Ready: string;
  ReadyTime: string;
  Picked: string;
  PickedTime: string;
  UserId: string;
  Priority: number;
  ItemCode: number;
  depcode: number;
}

// Parameters for the API call
export interface LoadItemsParams {
  flag: number;
  depcode: number;
  kotno: string;
  priority: number;
  itemcode: string;
  tblno: string;
}
export interface ApiModel {
  Kot: number; // number instead of 1
  Code: number; // number instead of 101
  MyProperty: string; // string instead of "ABC"
  Qty: number;
  Time: string;
  Barked: boolean;
  Ready: boolean;
  Picked: boolean;
  Cmnts: string;
}

// Fetch KOT items from API
export const loadItems = async (
  params: LoadItemsParams,
): Promise<KotOrder[]> => {
  return request<KotOrder[]>({
    method: "GET",
    url: "/api/kotdisplay/loaditems",
    params, // Axios will convert this object into query parameters
  });
};

export const markItemReady = async (model: KotOrder): Promise<void> => {
  return request<void>({
    method: "POST",
    url: "/api/kotdisplay/ready",
    data: model, // POST body
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const markItemPickUp = async (model: ApiModel): Promise<void> => {
  return request<void>({
    method: "POST",
    url: "/api/kotpickup/pick",
    data: model, // POST body
    headers: {
      "Content-Type": "application/json",
    },
  });
};
