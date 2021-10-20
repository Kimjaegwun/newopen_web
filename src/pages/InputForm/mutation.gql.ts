/** @format */

import { gql } from "@apollo/client";

export const GET_NEW_OPEN = gql`
  query {
    GetNewOpen {
      ok
      error
      newOpen {
        id
		loginId
		loginPw
		logo
		brand_name
		business_type
		description
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