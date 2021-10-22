/** @format */

import { gql } from "@apollo/client";

export const GET_NEW_OPEN = gql`
  query {
    GetNewOpen {
      ok
      error
      new_open {
        id
        login_id
        login_pw
        logo
        business_type
        brand_name
        address
        address_detail
        location
        description
        store_number
        business_hours
        photo_in_mall
        open_date
        phone_number
        coupon_touch
        approved
        menu {
          id
          name
          main_menu
          price
          photo
        }
        new_open_event{
          id
          content
          date_check
          start_date
          end_date
        }
      }
    }
  }
`;

export const NEW_OPEN_ID_CHECK = gql`
  mutation NewOpenIdCheck($login_id: String!) {
    NewOpenIdCheck(login_id: $login_id) {
      ok
      error
    }
  }
`;

export const ADD_NEW_OPEN = gql`
  mutation AddNewOpen($newOpenData: NewOpenData!) {
    AddNewOpen(newOpenData: $newOpenData) {
      ok
      error
    }
  }
`;


export const UPDATE_NEW_OPEN = gql`
  mutation UpdateNewOpen($updateNewOpenData: UpdateNewOpenData!) {
    UpdateNewOpen(updateNewOpenData: $updateNewOpenData) {
      ok
      error
    }
  }
`;
