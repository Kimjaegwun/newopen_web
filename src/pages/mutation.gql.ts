/** @format */

import { gql } from "@apollo/client";

export const GET_All_NEW_OPEN = gql`
  query {
    GetAllNewOpen {
      ok
      error
      new_open {
        id
        logo
        brand_name
        business_type
        address
        description
        business_hours
        open_date
        photo_in_mall
        menu {
          id
          name
          price
          photo
          main_menu
        }
        new_open_event {
          id
          content
          start_date
          end_date
        }
      }
    }
  }
`;