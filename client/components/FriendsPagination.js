import React from "react";
import PaginationStyles from "./styles/PaginationStyles";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { perPage } from "../config";
import Link from "next/link";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    dogsConnection {
      aggregate {
        count
      }
    }
  }
`;

const FriendsPagination = (props) => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <h2>Učitavanje...</h2>;
      const count = data.dogsConnection.aggregate.count;
      const pages = Math.ceil(count / perPage);
      const page = props.page;
      const propId = props.propId;
      return (
        <PaginationStyles>
          <Link
            prefetch
            href={{
              pathname: "friend",
              query: { page: page - 1 },
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              Prethodna
            </a>
          </Link>
          <p>
            Stranica {props.page} od {pages}
          </p>
          <Link
            prefetch
            href={{
              pathname: "friend",
              query: { page: page + 1 },
            }}
          >
            <a className="prev" aria-disabled={page >= pages}>
              Sljedeća
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default FriendsPagination;
